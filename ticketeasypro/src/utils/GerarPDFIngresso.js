import jsPDF from "jspdf";
import { getFullAddress } from ".";
import html2canvas from "html2canvas";
import QrCode from "qrcode";
import ticketTemplate from "./templateHTMLTicket";

async function adicionarPaginaIngresso(dados, pdf, idTicket) {
  try {
    const url = await QrCode.toDataURL(idTicket);
    var htmlTicket = ticketTemplate;
    htmlTicket = htmlTicket.replace("qrcodeBase64", url);
    htmlTicket = htmlTicket.replace("#TIPOEVENTO#", dados.event.category.name);
    htmlTicket = htmlTicket.replace("#IDCOMPRA#", dados.id);
    htmlTicket = htmlTicket.replace(
      "#DATAINICIO#",
      new Date(dados.event.initial_date).toLocaleDateString()
    );
    htmlTicket = htmlTicket.replace(
      "#DATATERMINO#",
      new Date(dados.event.final_date).toLocaleDateString()
    );
    htmlTicket = htmlTicket.replace("#EVENTO#", dados.event.name);
    htmlTicket = htmlTicket.replace(
      "#ENDERECO#",
      getFullAddress(dados.event.location)
    );
    htmlTicket = htmlTicket.replace("#IDINGRESSO#", idTicket);
    htmlTicket = htmlTicket.replace("#PESSOA#", dados.customer.name);

    const element = document.createElement("div");
    element.innerHTML = htmlTicket;
    document.body.appendChild(element);

    const canvas = await html2canvas(element.querySelector(".container"));
    const imgData = canvas.toDataURL("image/png", 0.4);
    pdf.addImage(imgData, "PNG", 0, 0, 10, 7);

    document.body.removeChild(element);

    return pdf;
  } catch (err) {
    console.error(err);
  }
}

export async function GerarPDFIngresso(dadosCompra) {
  var documento;
  var idTicket;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "cm",
    format: [10, 7],
    compress: true,
  });

  for (var k = 0; k <= dadosCompra.OrderTicket.length - 1; k++) {
    if (k != 0) {
      pdf.addPage({
        orientation: "landscape",
        unit: "cm",
        format: [10, 7],
        compress: true,
      });
    }
    idTicket = dadosCompra?.OrderTicket[k].ticket_id;
    documento = await adicionarPaginaIngresso(dadosCompra, pdf, idTicket);
  }

  if (documento) {
    var dataURL = documento.output("blob");

    const file = new File([dataURL], "ticket.pdf");
    return file;
  }

  return null;
}
