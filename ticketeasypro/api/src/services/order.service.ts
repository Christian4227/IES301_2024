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

// async function generatePDF(tickets: Ticket[]): Promise<Uint8Array> {
//   const pdfDoc = await PDFDocument.create();

//   const imageWidth = 450; // Adjust image width for better layout
//   const imageHeight = 450;
//   const fontSize = 20; // Adjust font size for readability

//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//   for (const ticket of tickets) {
//     const page = pdfDoc.addPage();
//     const pageWidth = page.getWidth();
//     const pageHeight = page.getHeight();
//     const qrX = (pageWidth - imageWidth) / 2; // Center image horizontally
//     const qrY = (pageHeight - imageHeight) / 2; // Center image vertically
//     const text = `Ticket ID: ${ticket.ticket_id}`;
//     const textWidth = font.widthOfTextAtSize(text, fontSize);
//     const textX = (pageWidth - textWidth) / 2; // Center text horizontally
//     const textY = qrY - fontSize - 10; // Position text below the QR code

//     const qrData = await generateQRCode(ticket.ticket_id);
//     const qrImage = await pdfDoc.embedPng(qrData);

//     page.drawImage(qrImage, { x: qrX, y: qrY, width: imageWidth, height: imageHeight });

//     page.drawText(text, { x: textX, y: textY, size: fontSize, font: font, color: rgb(0, 0, 0), });
//   }

//   const pdfBytes = await pdfDoc.save();
//   return pdfBytes;
// }

// Função para criar o PDF
// async function generatePDF(order: OrderWithTickets): Promise<Uint8Array> {
//   const pdfDoc = await PDFDocument.create();
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//   for (const orderTicket of order.OrderTicket) {

//     const page = pdfDoc.addPage([450, 230]); // Definindo tamanho da página
//     const { width, height } = page.getSize();

//     // Título
//     const title = `${order.event.name}`;
//     page.drawText(title, {
//       x: 50,
//       y: height - 50,
//       size: 20,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     // Data do evento
//     const eventDate = `${order.event.initial_date.toLocaleString('pt-BR', {
//       day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit',
//       minute: '2-digit', hour12: false,
//     })}`;

//     page.drawText(eventDate, {
//       x: 50,
//       y: height - 80,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     // Informação do ticket
//     page.drawText(`Ticket #: ${orderTicket.ticket_id}`, {
//       x: 50,
//       y: height - 110,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0),
//     });
//     try {


//       page.drawText(`Ingresso: ${orderTicket.TicketType?.name}`, {
//         x: 50,
//         y: height - 130,
//         size: 12,
//         font,
//         color: rgb(0, 0, 0),
//       });
//     } catch (error) {
//       console.log(error)
//     }

//     page.drawText(`Cliente: ${order.customer.email}`, {
//       x: 50,
//       y: height - 150,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     page.drawText(`Local: ${order.event.location.name}`, {
//       x: 50,
//       y: height - 170,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0),
//     });



//     // QR Code
//     const qrCodeDataUrl = await generateQRCode(orderTicket.ticket_id);
//     const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
//     page.drawImage(qrImage, {
//       x: 50,
//       y: 35,
//       width: 200,
//       height: 200,
//     });

//     // Texto abaixo do QR Code
//     page.drawText(`Check in for this event`, {
//       x: 260,
//       y: 100,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0),
//     });

//     page.drawText(`Scan this QR code at the event to check in.`, {
//       x: 260,
//       y: 80,
//       size: 12,
//       font,
//       color: rgb(0, 0, 0),
//     });
//   }

//   const pdfBytes = await pdfDoc.save();
//   return pdfBytes;
// }

async function generatePDF(order: OrderWithTickets): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pageWidth = 450;
  const pageHeight = 700;
  const ticketHeight = 230;

  let page = pdfDoc.addPage([pageWidth, pageHeight]); // Definindo tamanho da página
  const { width, height } = page.getSize();
  let currentY = height - 50;

  for (let i = 0; i < order.OrderTicket.length; i++) {
    const orderTicket = order.OrderTicket[i];

    if (i > 0 && i % 3 === 0) {
      // Adicionar nova página para cada três tickets
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      currentY = height - 45; // era 50
    }

    // Título
    const title = `${order.event.name}`;
    page.drawText(title, {
      x: 50,
      y: currentY - 5,
      size: 20,
      font,
      color: rgb(0, 0, 0),
    });

    // Data do evento
    const eventDate = `${order.event.initial_date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit',
      minute: '2-digit', hour12: false,
    })}`;

    page.drawText(eventDate, {
      x: width - 150,
      y: currentY - 90,
      size: 12,
      font,
      color: rgb(0, 0, 0),

    });

    // Informação do ticket
    page.drawText(`Ticket #: ${orderTicket.ticket_id}`, {
      x: 50,
      y: currentY - 35,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Ingresso: ${orderTicket.TicketType?.name}`, {
      x: 50,
      y: currentY - 50,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Cliente: ${order.customer.email}`, {
      x: 50,
      y: currentY - 70,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Local: ${order.event.location.name}`, {
      x: 50,
      y: currentY - 90,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    // QR Code
    const qrCodeDataUrl = await generateQRCode(orderTicket.ticket_id);
    const qrImage = await pdfDoc.embedPng(qrCodeDataUrl);
    page.drawImage(qrImage, {
      x: 45,
      y: currentY - 195,
      width: 100,
      height: 100,
    });

    // Texto abaixo do QR Code
    page.drawText(`Check in for this event`, {
      x: 160,
      y: currentY - 150,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Scan this QR code at the event to check in.`, {
      x: 160,
      y: currentY - 170,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });

    // Adicionar linha tracejada entre os tickets
    if (i % 3 !== 2 && i !== order.OrderTicket.length - 1) {
      const dashWidth = 5;
      const spaceWidth = 5;
      for (let x = 50; x < width - 50; x += dashWidth + spaceWidth) {
        page.drawLine({
          start: { x, y: currentY - 210 },
          end: { x: x + dashWidth, y: currentY - 210 },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      }
    }

    currentY -= ticketHeight;
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

    const pdfBytes = await generatePDF(customerOrder);
    const result = sendEmailWithAttachments(to, `Oi ${customerName}. Seus ingressos estão aqui.`, htmlContent, pdfBytes)
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
