import { PaginationParams, QueryIntervalDate } from "@interfaces/common.interface";
import { Order } from "@interfaces/order.interface";
import { EventStatus, OrderStatus, Prisma, TicketStatus } from "@prisma/client";
import { getLastdayOfNextMonthTimestamp, getStartOfDayTimestamp } from "@utils/mixes";
import OrderRepository from "src/repositories/order.repository";
import { OrderCreate } from "types/order.type";
import AccountService from "./account.service";
import prisma from "src/repositories/prisma";
import { PaymentMethod } from "src/schema/order.schema";

export class OrderService {
  private orderRepository: OrderRepository;
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async createOrderWithOrderTicketsAndTickets(customerId: string, orderCreate: OrderCreate) {
    const { eventId, paymentMethod, orderTickets } = orderCreate;
    const order = await this.orderRepository.createOrder(customerId, eventId, paymentMethod, orderTickets);
    return order;
  };


  async searchOrdersByEmail(
    customerEmail: string,
    paginationParams: PaginationParams = { page: 1, pageSize: 10 },
    orderBy: Prisma.OrderOrderByWithRelationInput[] = [{ created_at: "asc" }],
    queryIntervalDate: QueryIntervalDate,
    national: boolean,
    statusEvent: EventStatus = EventStatus.IN_PROGRESS,
    statusOrder: OrderStatus = OrderStatus.PROCESSING,
    categoryId?: number
  ) {

    const startDate = new Date(queryIntervalDate.tsStartDate ? queryIntervalDate.tsStartDate : getStartOfDayTimestamp());
    const endDate = new Date(queryIntervalDate.tsEndDate ? queryIntervalDate.tsEndDate : getLastdayOfNextMonthTimestamp());
    // const location = { country: national ? { equals: 'BRASIL' } : { not: 'BRASIL' } }

    const accountService: AccountService = new AccountService();
    const accountUser = await accountService.getOne({ email: customerEmail });

    const orders = this.searchOrders(accountUser.id, paginationParams, orderBy,
      { tsStartDate: startDate.getTime(), tsEndDate: endDate.getTime() },
      national, statusEvent as EventStatus, statusOrder, categoryId)

    return orders;
  };
  async searchOrders(
    customerEmail: string,
    paginationParams: PaginationParams = { page: 1, pageSize: 10 },
    orderBy: Prisma.OrderOrderByWithRelationInput[] = [{ created_at: "asc" }],
    queryIntervalDate: QueryIntervalDate,
    national: boolean,
    statusEvent: EventStatus = EventStatus.IN_PROGRESS,
    statusOrder: OrderStatus = OrderStatus.PROCESSING,
    categoryId?: number
  ) {

    const startDate = new Date(queryIntervalDate.tsStartDate ? queryIntervalDate.tsStartDate : getStartOfDayTimestamp());
    const endDate = new Date(queryIntervalDate.tsEndDate ? queryIntervalDate.tsEndDate : getLastdayOfNextMonthTimestamp());
    const location = { country: national ? { equals: 'BRASIL' } : { not: 'BRASIL' } }

    // Lógica para buscar e paginar as ordens
    const orders = await this.orderRepository.getOrders(customerEmail, location, categoryId, startDate, endDate, orderBy, paginationParams, statusEvent, statusOrder);
    return orders;
  };
  getOrderById = async (orderId: string): Promise<Order> => {
    const order = await this.orderRepository.findDetails(orderId)
    if (!order)
      throw new Error('OrderNotFound');
    return order

  };
  updateOrderStatus = async (orderId: string, status: OrderStatus, paymentMethod?: PaymentMethod): Promise<Order> => {

    const order = await this.getOrderById(orderId);
    if (!order) throw new Error('OrderNotFound');

    return await prisma.$transaction(async (transaction) => {
      // Atualizar status e método de pagamento da ordem (se fornecido)
      const orderUpdated = await transaction.order.update({
        where: { id: orderId },
        data: { status, ...(paymentMethod !== undefined && { payment_method: paymentMethod }) }
      });

      // Se o status da ordem for COMPLETED, atualizar o status dos tickets relacionados
      if (status === OrderStatus.COMPLETED) {
        await transaction.ticket.updateMany({
          where: { OrderTicket: { some: { order_id: order.id } } },
          data: { status: TicketStatus.AVAILABLE },
        });
      };
      if (status === OrderStatus.CANCELLED) {
        await transaction.ticket.updateMany({
          where: { OrderTicket: { some: { order_id: order.id } } },
          data: { status: TicketStatus.CANCELLED },
        });
      };
      return orderUpdated;
    });
  }
}
