-- AddForeignKey
ALTER TABLE "ORDERTICKETS" ADD CONSTRAINT "ORDERTICKETS_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "TICKETS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;