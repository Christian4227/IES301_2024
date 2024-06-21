import { PaginationParams, QueryIntervalDate } from "@interfaces/common.interface";
import { Order } from "@interfaces/order.interface";
import { EventStatus, OrderStatus, Prisma } from "@prisma/client";
import { getLastdayOfNextMonthTimestamp, getStartOfDayTimestamp } from "@utils/mixes";
import OrderRepository from "src/repositories/order.repository";
import { OrderCreate } from "types/order.type";

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


  async searchOrders(
    customerId: string,
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
    const orders = await this.orderRepository.getOrders(customerId, location, categoryId, startDate, endDate, orderBy, paginationParams, statusEvent, statusOrder);
    return orders;
  };
  getOrderById = async (orderId: string): Promise<Order> => {
    const order = await this.orderRepository.findDetails(orderId)
    if (!order)
      throw new Error('OrderNotFound');
    return order

  };
}
