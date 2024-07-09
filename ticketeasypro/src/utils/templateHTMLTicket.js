const ticketTemplate = `<!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.info-table th,
.info-table td {
  padding: 10px;
  text-align: left;
}

.info-table th {
  font-weight: bold;
}

.venue-table,
.event-manager-table {
  width: 50%;
  float: left;
  margin-top: 20px;
}

.venue-table th,
.event-manager-table th {
  display: none;
}

.venue-table td,
.event-manager-table td {
  border-bottom: none;
  padding: 10px;
}

.qr-code {
  float: left;
  width: 50%;
  text-align: center;
  margin-bottom: 20px; /* added margin bottom */
  margin-top: 10vh;
}

.qr-code img {
  max-width: 100%;
  height: auto;
}

.check-in {
  float: right;
  width: 50%;
  text-align: center;
  margin-top: 10vh;
}

.check-in h2 {
  margin-top: 0;
}

.clear {
  clear: both;
}

/* added media query for responsive design */
@media (max-width: 768px) {
  .venue-table, .event-manager-table {
    width: 100%;
    float: none;
  }
  .qr-code, .check-in {
    width: 100%;
    float: none;
  }
}
</style>
</head>
<body>
  <div class="container">
    <h1>#EVENTO#</h1>
    <h2>#DATAINICIO# | #DATATERMINO#</h2>

    <table class="info-table">
      <tr>
        <th>ID DO INGRESSO</th>
        <th>TIPO DE EVENTO</th>
        <th>CLIENTE</th>
        <th>ID DA COMPRA</th>
      </tr>
      <tr>
        <td>#IDINGRESSO#</td>
        <td>#TIPOEVENTO#</td>
        <td>#PESSOA#</td>
        <td>#IDCOMPRA#</td>
      </tr>
    </table>

    <table class="venue-table">
      <tr>
        <td><strong>ENDEREÇO</strong></td>
      </tr>
      <tr>
        <td>#ENDERECO#</td>
      </tr>
    </table>

    <div class="clear"></div>

    <div class="qr-code">
      <img src="qrcodeBase64" alt="QR Code">
    </div>
    <div class="check-in">
      <h2>Confira o evento</h2>
      <h3>Escaneie esse QR Code no local do evento para check in.</h3>
    </div>
    <div class="clear"></div>
  </div>
</body>
</html>`;

export default ticketTemplate;
