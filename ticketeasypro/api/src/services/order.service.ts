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

interface Ticket {
  id: number; order_id: string; ticket_id: string; unit_price: number;
  created_at: Date | string; updated_at: Date | string; ticketTypeId: number | null;
}

async function generateQRCode(ticketId: string): Promise<string> {
  try {
    const qrData = await QRCode.toDataURL(ticketId);
    return qrData;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}


// async function generatePDF(tickets: Ticket[]): Promise<Uint8Array> {
//   const pdfDoc = await PDFDocument.create();

//   const imageWidth = 500; // Adjust image width for better layout
//   const imageHeight = 500;
//   const fontSize = 20; // Adjust font size for readability

//   for (const ticket of tickets) {
//     const page = pdfDoc.addPage();
//     const pageWidth = page.getWidth();
//     const pageHeight = page.getHeight();
//     const textX = (pageWidth - imageWidth) / 2; // Center image horizontally
//     const qrY = (pageHeight - imageHeight) / 2; // Center image vertically
//     const textY = qrY - fontSize - 10; // Position text below the QR code

//     const qrData = await generateQRCode(ticket.ticket_id);
//     const qrImage = await pdfDoc.embedPng(qrData);

//     page.drawImage(qrImage, {
//       x: textX, // Center image horizontally
//       y: qrY,
//       width: imageWidth,
//       height: imageHeight,
//     });

//     page.drawText(`Ticket ID: ${ticket.ticket_id}`, {
//       x: textX * 1.5 - `Ticket ID: ${ticket.ticket_id}`.length, // Center text horizontally
//       y: textY,
//       size: fontSize,
//     });

//     // if (!multiPage) break; // Exit the loop after the first page if multiPage is false
//   }

//   const pdfBytes = await pdfDoc.save();
//   return pdfBytes;
// }

async function generatePDF(tickets: Ticket[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  const imageWidth = 450; // Adjust image width for better layout
  const imageHeight = 450;
  const fontSize = 20; // Adjust font size for readability

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const ticket of tickets) {
    const page = pdfDoc.addPage();
    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();
    const qrX = (pageWidth - imageWidth) / 2; // Center image horizontally
    const qrY = (pageHeight - imageHeight) / 2; // Center image vertically
    const text = `Ticket ID: ${ticket.ticket_id}`;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textX = (pageWidth - textWidth) / 2; // Center text horizontally
    const textY = qrY - fontSize - 10; // Position text below the QR code

    const qrData = await generateQRCode(ticket.ticket_id);
    const qrImage = await pdfDoc.embedPng(qrData);

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: imageWidth,
      height: imageHeight,
    });

    page.drawText(text, {
      x: textX,
      y: textY,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 0),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export class OrderService {
  private orderRepository: OrderRepository;
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  sendTicketsQrCodeForEmail = async (orderId: string, multiPage: boolean): Promise<{}> => {
    const customerOrder = await prisma.order.findUnique({
      where: { id: orderId }, select: {
        status: true,
        customer: { select: { email: true, name: true } }
      }
    })
    const to = customerOrder?.customer.email;
    
    if (!to) throw new Error('CustomerNotFound');

    switch (customerOrder?.status) {
      case OrderStatus.CANCELLED:
        return { "fail": "OrderCancelled" };
      case OrderStatus.PROCESSING:
        return { "fail": "OrderReservedPendingPayment" }
    }

    const tickets = await this.orderRepository.findOrderTickets(orderId)
    if (tickets.length === 0) throw new Error('OrderNotFound');

    const pdfBytes = await generatePDF(tickets);
    const result = sendEmailWithAttachments(to, `Oi ${customerOrder.customer.name}. Seus ingressos estão aqui.`, pdfBytes)
    return { "success": result }

  };

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
    const orders = await this.orderRepository.getOrders(customerEmail, location, startDate, endDate, orderBy, paginationParams, statusEvent, statusOrder, categoryId);
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
