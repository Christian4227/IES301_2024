import { PaginationParams } from "@interfaces/common.interface";
import { Order } from "@interfaces/order.interface";
import { OrderStatus, Prisma } from "@prisma/client";
import OrderRepository from "src/repositories/order.repository";
import { OrderCreate, PaymentMethod } from "src/schema/order.schema";
import { OrderTicketSchema } from "src/schema/orderTicket.schema";


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
    customerId?: string,
    eventId?: number,
    orderBy: Prisma.OrderOrderByWithRelationInput[] = [{ created_at: "asc" },],
    paginationParams: PaginationParams = { page: 1, pageSize: 10 },
    status: OrderStatus = OrderStatus.PROCESSING,
    payment_method: PaymentMethod = PaymentMethod.PIX) {

    // Lógica para buscar e paginar as ordens
    const orders = await this.orderRepository.getOrders(
      customerId, eventId, orderBy, paginationParams, status, payment_method
    );
    return orders;
  };
  getOrderById = async (orderId: string): Promise<Order> => {
    const order = await this.orderRepository.findDetails(orderId)
    if (!order) 
      throw new Error('OrderNotFound');
    return order

  };
}
