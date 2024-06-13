import { OrderCreateInput, OrderUpdateInput } from "@interfaces/order.interface";
import prisma from "./prisma";
import { Order, PaymenMethod, Prisma } from "@prisma/client";

class OrderRepository {
  private orderDb: Prisma.OrderDelegate;

  constructor() {
    this.orderDb = prisma.order;
  }

  async createOrder(data: OrderCreateInput): Promise<Order> {
    return this.orderDb.create({
      data: {
        customer_id: data.customerId,
        event_id: data.eventId,
        total_amount: data.totalAmount,
        payment_method: data.paymentMethod,
      },
    });
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    return this.orderDb.findUnique({
      where: { id: orderId },
    });
  }

  async updateOrder(orderId: string, data: OrderUpdateInput): Promise<Order> {
    return this.orderDb.update({
      where: { id: orderId },
      data,
    });
  }

  async deleteOrder(orderId: string): Promise<Order> {
    return this.orderDb.delete({
      where: { id: orderId },
    });
  }

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    return this.orderDb.findMany({
      where: { customer_id: customerId },
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderDb.findMany();
  };



  async createOrderWithOrderTicketsAndTickets(
    customerId: string, eventId: number,
    payment_method: PaymenMethod = "PIX", orderTicketsData: { unit_price: number, type_id: number, quantity: number }[]
  ) {
    let totalAmount: number = 0.0;
    const event = await prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: { base_price: true, capacity: true, id: true }
    });

    try {
      const result = await prisma.$transaction(async (prisma) => {
        // 1. Criar a ordem de compra (Order)
        const order = await prisma.order.create({
          data: {
            customer_id: customerId,
            event_id: event.id,
            total_amount: totalAmount,
            status: 'PROCESSING',
            payment_method: payment_method,
          },
        });

        // 2. Criar os tickets associados
        const ticketPromises = orderTicketsData.map(async (ticketData) => {
          const { unit_price, type_id } = ticketData;

          // Criar o Ticket associado ao evento
          const ticket = await prisma.ticket.create({
            data: { event_id: eventId, status: 'AVAILABLE' },
          });

          return { ticket, unit_price, type_id };
        });

        // Executar todas as operações de criação de Ticket
        const createdTickets = await Promise.all(ticketPromises);

        // 3. Criar os itens da ordem de compra (OrderTicket) e associar aos tickets criados
        const orderTicketPromises = createdTickets.map(async (ticketData) => {
          const { ticket, unit_price, type_id } = ticketData;

          // Criar o OrderTicket associado ao Order e ao Ticket
          const orderTicket = await prisma.orderTicket.create({
            data: {
              order_id: order.id,
              ticket_id: ticket.id,
              unit_price: unit_price,
              ticketTypeId: type_id
            },
          });
          return orderTicket;
        });

        // Executar todas as operações de criação de OrderTicket
        const createdOrderTickets = await Promise.all(orderTicketPromises);

        return { order, createdTickets, createdOrderTickets };
      });

      return result;
    } catch (error) {
      console.error('Erro ao criar Order com OrderTickets e Tickets:', error);
      throw error;

    }
  }
}

export default OrderRepository;
