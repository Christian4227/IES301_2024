export const makeConfirmEmailContent = (user: { name: string, email: string }, confirmationUrl: string) => {
    return `<!DOCTYPE html>
    <html lang="pt-br">    
    <head>
      <meta http-equiv="X-UA-Compatible" content="IE-edge">
      <meta content="text/html" charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Ticket Easy Pro</title>
    </head>
    
    <body>
      <table style="background-color: #F1F1F1; width: 480px;">
        <tr>
          <td style="background-color: black; color: white; text-align: center; padding: 0.2em;">
            <h1>Event Mais Você</h1>
          </td>
        </tr>
        <tr>
          <td>
            <table style="padding: 0.2em; width: 100%;">
              <tr>
                <td>
                  <table style="padding: 0.2em; text-align: center; width: 100%;">
                    <tr>
                      <td>
                        <h1>Sistema Ticket Easy Pro</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: gray; height: 0.4px; width: 100%; margin: 10px 0;">
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table style="padding: 1em; width: 100%;">
                    <tr>
                      <td>
                        <p style="text-align: justify;"><b>Olá,</b> ${user.name}</p><br />
                        <p style="text-align: justify;">Confirme o seu e-mail para acessar a área
                          restrita, finalizar a compra e
                          receber o seu ingresso.</p><br />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table style="background-color: black; color: white; padding: 1em; width: 100%;">
                    <tr>
                      <td>
                        <p style="text-align: justify;"><b>Nome: </b>${user.name}</p><br>
                        <p style="text-align: justify;"><b>E-mail de acesso: </b>${user.email}</p><br>
                        <p style="text-align: justify;"><b>Tempo para confirmar: </b>15 minutos</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table style="text-align: center; padding: 1em; width: 100%;">
                    <tr>
                      <td>
                        <p style="text-align: justify; margin: 10px 0;">Se recebeu este e-mail por
                          engano ou alguma informação
                          estiver errada, ignore este e-mail.</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table style="width: 100%;">
                          <tr>
                            <td
                              style="background-color: #2C1CEE; color: white; border: 0; padding: 10px; width: 50%; border-radius: 5px; font-size: 1.1em; cursor: pointer; margin: 10px; display: inline-block;">
                              <a href="${confirmationUrl}" style="color: white; text-decoration: none;">Confirmar</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: gray; height: 0.4px; width: 99%; margin: 10px 0;"></td>
                    </tr>
                    <tr>
                      <td>
                        <b>
                          <p style="text-align: justify; margin: 10px 0;">Se expirar o tempo de
                            confirmação do e-mail, é
                            possível reenviar este e-mail na página de cadastro da Event Mais Você.
                          </p>
                        </b>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table style="width: 100%;">
              <tr>
                <td style=" background-color: black; height: 30px; width: 100%;"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    </html>
`;
}

export const makeResetEmailContent = (user: { name: string, email: string }, resetUrl: string) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-br">
    
    <head>
      <meta http-equiv="X-UA-Compatible" content="IE-edge">
      <meta content="text/html" charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Ticket Easy Pro</title>
    </head>
    
    <body>
      <table style="background-color: #F1F1F1; width: 480px;">
        <tr>
          <td style="background-color: black; color: white; text-align: center; padding: 0.2em;">
            <h1>Event Mais Você</h1>
          </td>
        </tr>
        <tr>
          <td>
            <table style="padding: 0.2em; width: 100%;">
              <tr>
                <td>
                  <table style="padding: 0.2em; text-align: center; width: 100%;">
                    <tr>
                      <td>
                        <h1>Sistema Ticket Easy Pro</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: gray; height: 0.4px; width: 100%; margin: 10px 0;">
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table style="padding: 1em; width: 100%;">
                    <tr>
                      <td>
                        <p style="text-align: justify;"><b>Olá,</b> ${user.name}.</p><br />
                        <p style="text-align: justify;">Recebemos uma solicitação para redefinir sua senha.<br />
                          Vamos criar uma nova para você.</p><br />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table style="background-color: black; color: white; padding: 1em; width: 100%;">
                    <tr>
                      <td>
                        <p style="text-align: justify;"><b>Nome: </b>${user.name}</p><br>
                        <p style="text-align: justify;"><b>E-mail de acesso: </b>${user.email}</p><br>
                        <p style="text-align: justify;"><b>Tempo para confirmar: </b>15 minutos</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table style="text-align: center; padding: 1em; width: 100%;">
                    <tr>
                      <td>
                        <p style="text-align: justify; margin: 10px 0;">Não solicitou uma redefinição de senha? Você pode
                          ignorar esta mensagem.</p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table style="width: 100%;">
                          <tr>
                            <td
                              style="background-color: #2C1CEE; color: white; border: 0; padding: 10px; width: 50%; border-radius: 5px; font-size: 1.1em; cursor: pointer; margin: 10px; display: inline-block;">
                              <a href="${resetUrl}" style="color: white; text-decoration: none;">Confirmar</a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: gray; height: 0.4px; width: 99%; margin: 10px 0;"></td>
                    </tr>
                    <tr>
                      <td>
                        <b>
                          <p style="text-align: justify; margin: 10px 0;">Este link irá expirar nos próximos 15 minutos.
                          </p>
                        </b>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td>
            <table style="width: 100%;">
              <tr>
                <td style=" background-color: black; height: 30px; width: 100%;"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    
    </html>
`;
    return htmlContent;

}