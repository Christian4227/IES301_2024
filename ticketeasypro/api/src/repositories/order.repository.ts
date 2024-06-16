// import { OrderCreate, OrderCreateInput, OrderTicketCreate, OrderUpdateInput } from "@interfaces/order.interface";
import { Order, OrderStatus, Prisma } from "@prisma/client";
import { PaymentMethod } from "./../schema/order.schema"
import prisma from "./prisma";
import { OrderTicket } from "src/schema/orderTicket.schema";
import { OrderResult, RepoOrderCreate } from "@interfaces/order.interface";
import { PaginateParams } from "types/common.type";
import { PaginatedOrderResult } from "types/order.type";
import { PaginationParams } from "@interfaces/common.interface";
import { paginate } from "@utils/paginate";

class OrderRepository {
  private orderDb: Prisma.OrderDelegate;
  constructor() {
    this.orderDb = prisma.order;
  };
  async create(customerId: string, totalAmount: number, orderCreate: RepoOrderCreate): Promise<Order> {
    const { eventId, paymentMethod } = orderCreate;
    return await this.orderDb.create({
      data: {
        event_id: eventId,
        payment_method: paymentMethod,
        customer_id: customerId,
        total_amount: totalAmount,
        status: OrderStatus.PROCESSING // Default status if not provided
      }
    });
  }

  async findDetails(orderId: string): Promise<Order | null> {
    return this.orderDb.findUnique({
      where: { id: orderId }
    });
  }

  // async updateOrder(orderId: string, data: OrderUpdateInput): Promise<Order> {
  //   return this.orderDb.update({
  //     where: { id: orderId },
  //     data,
  //   });
  // }

  // async deleteOrder(orderId: string): Promise<Order> {
  //   return this.orderDb.delete({
  //     where: { id: orderId },
  //   });
  // }

  // async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
  //   return this.orderDb.findMany({
  //     where: { customer_id: customerId },
  //   });
  // }

  async getOrders(
    customerId?: string,
    eventId?: number,
    orderBy: Prisma.OrderOrderByWithRelationInput[] = [{ created_at: "asc" },],
    paginationParams: PaginationParams = { page: 1, pageSize: 10 },
    status: OrderStatus = OrderStatus.PROCESSING,
    payment_method: PaymentMethod = PaymentMethod.PIX
  ): Promise<PaginatedOrderResult> {

    const whereClause: Prisma.OrderWhereInput = { AND: { payment_method: payment_method, status: status } }

    if (customerId)
      whereClause.AND = { ...whereClause.AND, customer_id: customerId }

    if (eventId)
      whereClause.AND = { ...whereClause.AND, event_id: eventId }

    const select = {
      id: true,
      customer_id: true, event_id: true, total_amount: true, status: true, payment_method: true,
      created_at: true, updated_at: true
    };

    // Parâmetros de paginação incluindo orderBy
    const paginateParams: PaginateParams<Prisma.OrderDelegate, Prisma.OrderWhereInput, Prisma.OrderOrderByWithRelationInput[]> = {
      model: this.orderDb,
      where: whereClause,
      paginationParams,
      select,
      orderBy
    };

    const paginated = await paginate<OrderResult, Prisma.OrderWhereInput, Prisma.OrderOrderByWithRelationInput[], typeof this.orderDb>(
      paginateParams
    );
    return paginated;

  };

  async createOrder(customerId: string, eventId: number, payment_method: PaymentMethod, orderTickets: OrderTicket[]) {
    // 1. Buscar informações do evento
    const event = await prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: { base_price: true, capacity: true, id: true },
    });

    // 2. Buscar tipos de tickets
    const typeIds = orderTickets.map(orderTicket => orderTicket.typeId);
    const typesTicket = await prisma.ticketType.findMany({
      where: { id: { in: typeIds } },
      select: { id: true, discount: true }
    });

    // 3. Adicionar desconto ao objeto orderTickets
    const orderTicketsWithDiscount = orderTickets.map(orderTicket => {
      const ticketType = typesTicket.find(type => type.id === orderTicket.typeId);
      return { ...orderTicket, discount: ticketType ? ticketType.discount : 0 };
    });
    // 4. Calcular o valor total da ordem
    const totalAmount = orderTicketsWithDiscount.reduce((acc, orderTicket) => {
      const unitaryPrice = Math.round(event.base_price * (1 - orderTicket.discount / 100));
      return acc + (unitaryPrice * orderTicket.quantity);
    }, 0); // Em centavos

    try {
      const result = await prisma.$transaction(async (prisma) => {

        // const orderCreate: RepoOrderCreate = {
        //   eventId: event.id,
        //   paymentMethod: payment_method
        // };

        // 5. Criar a ordem de compra (Order)
        const order = await prisma.order.create({
          data: {
            event_id: event.id,
            payment_method: payment_method,
            customer_id: customerId,
            total_amount: totalAmount,
            status: "PROCESSING"
          }
        });

        // 6. Criar tickets e itens da ordem de compra (OrderTicket)
        const ticketPromises = orderTicketsWithDiscount.flatMap(orderTicket => {
          return Array(orderTicket.quantity).fill(null).map(async () => {
            // Criar o Ticket
            const ticket = await prisma.ticket.create({
              data: {
                event_id: event.id,
                status: 'RESERVED'
              },
            });

            // Criar o OrderTicket
            return prisma.orderTicket.create({
              data: {
                order_id: order.id,
                ticket_id: ticket.id,
                unit_price: event.base_price, // Em centavos
                ticketTypeId: orderTicket.typeId
              },
            });
          });
        });

        const orderTickets = await Promise.all(ticketPromises);

        return { order, orderTickets };
      }, {
        timeout: 10000 // Aumentar o timeout para 10 segundos
      });

      return result;
    } catch (error) {
      console.error('Erro ao criar Order com OrderTickets e Tickets:', error);
      throw error;
    }
  }


}

export default OrderRepository;
