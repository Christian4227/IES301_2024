import { PaginationParams, QueryIntervalDate } from "@interfaces/common.interface";
import { Order } from "@interfaces/order.interface";
import { EventStatus, OrderStatus, Prisma, TicketStatus } from "@prisma/client";
import { getLastdayOfNextMonthTimestamp, getStartOfDayTimestamp } from "@utils/mixes";
import OrderRepository from "src/repositories/order.repository";
import { OrderCreate } from "types/order.type";
import AccountService from "./account.service";
import prisma from "src/repositories/prisma";
import { PaymentMethod } from "src/schema/order.schema";

import QRCode from 'qrcode';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { sendEmailWithAttachments } from "@utils/sendEmail";
import { makeTicketEmailContent } from "@utils/templates";

interface OrderWithTickets {
  id: string;
  status: string; // ou o tipo adequado para status
  event: {
    name: string;
    initial_date: Date;
    location: {
      name: string;
    };
  };
  customer: {
    name: string;
    email: string;
  };
  OrderTicket: {
    ticket_id: string;
    TicketType: {
      id: number;
      name: string;
    } | null;
  }[];
}

// interface Ticket {
//   id: number; order_id: string; ticket_id: string; unit_price: number;
//   created_at: Date | string; updated_at: Date | string; ticketTypeId: number | null;
// }

async function generateQRCode(ticketId: string): Promise<string> {
  try {

    const qrData = await QRCode.toDataURL(ticketId);
    return qrData;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

// async function generatePDF(file: string): Promise<Uint8Array> {
//   const pdfDoc = await PDFDocument.create();

//   const pdfBytes = await pdfDoc.save();
//   return pdfBytes;
// }

export class OrderService {
  private orderRepository: OrderRepository;
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  sendTicketsQrCodeForEmail = async (orderId: string, multiPage: boolean, file: any): Promise<{}> => {

    const customerOrder = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        event: {
          select: {
            name: true,
            initial_date: true,
            location: { select: { name: true } },
          },
        },
        customer: {
          select: { email: true, name: true }
        },
        OrderTicket: {
          select: {
            ticket_id: true,
            TicketType: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    }) as OrderWithTickets;

    if (!customerOrder)
      throw new Error('CustomerNotFound');

    let to = customerOrder?.customer.email;

    if (!to) throw new Error('CustomerNotFound');

    switch (customerOrder?.status) {
      case OrderStatus.CANCELLED:
        return { "fail": "OrderCancelled" };
      case OrderStatus.PROCESSING:
        return { "fail": "OrderReservedPendingPayment" }
    }

    const tickets = await this.orderRepository.findOrderTickets(orderId)
    if (tickets.length === 0) throw new Error('OrderNotFound');

    const dataEvent = customerOrder?.event.initial_date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit',
      minute: '2-digit', hour12: false,
    });
    const email = customerOrder?.customer.email ?? ''
    const eventName = customerOrder?.event.name ?? ''
    const customerName = customerOrder?.customer.name ?? ''


    const htmlContent = makeTicketEmailContent(email, eventName, customerName, dataEvent ?? '')
    const result = sendEmailWithAttachments(to, `Oi ${customerName}. Seus ingressos estão aqui.`, htmlContent, file)
    return { "success": result }

  };

  async createOrderWithOrderTicketsAndTickets(customerId: string, orderCreate: OrderCreate) {
    const { eventId, paymentMethod, orderTickets } = orderCreate;
    const order = await this.orderRepository.createOrder(customerId, eventId, paymentMethod, orderTickets);
    return order;
  }

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
  }
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
    const orders = await this.orderRepository.getOrders(customerEmail, location, startDate, endDate, orderBy, paginationParams, statusEvent, statusOrder, categoryId);
    return orders;
  }
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
      }
      if (status === OrderStatus.CANCELLED) {
        await transaction.ticket.updateMany({
          where: { OrderTicket: { some: { order_id: order.id } } },
          data: { status: TicketStatus.CANCELLED },
        });
      }
      return orderUpdated;
    });
  }
}
