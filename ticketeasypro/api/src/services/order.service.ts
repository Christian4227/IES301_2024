import { PaymenMethod, PrismaClient, Role } from "@prisma/client";
// import { OrderCreate } from "@interfaces/order.interface";
import { FastifyInstance } from "./../types/fastify";
import { OrderCreate } from "@interfaces/order.interface";
import OrderRepository from "src/repositories/order.repository";
import { prisma } from "./prisma";


export class OrderService {
  private orderRepository: OrderRepository;
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async create(role: Role, orderData: OrderCreate, api: FastifyInstance) {
    // Lógica para criar uma nova ordem
    const newOrder = await prisma.order.create({
      data: {
        ...orderData,
        // Adicione qualquer lógica adicional necessária
      },
    });
    return newOrder;
  }


  async searchOrders(filter: string, page: number, pageSize: number) {
    // Lógica para buscar e paginar as ordens
    const orders = await prisma.order.findMany({
      where: { /* Adicione filtros conforme necessário */ },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const totalOrders = await prisma.order.count({
      where: { /* Adicione filtros conforme necessário */ },
    });
    return { orders, totalOrders };
  };

  async getOrderById(orderId: string) {
    // Lógica para buscar uma ordem por ID
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    return order;
  };


  async createOrderWithOrderTicketsAndTickets(
    customerId: string, eventId: number,
    payment_method: PaymenMethod = "PIX", orderTicketsData: { unit_price: number, type_id: number, quantity: number }[]
  ) {
    this.createOrderWithOrderTicketsAndTickets
  }
}
