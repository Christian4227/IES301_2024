-- CreateIndex
CREATE INDEX "EVENTS_category_id_manager_id_location_id_idx" ON "EVENTS"("category_id", "manager_id", "location_id");

-- CreateIndex
CREATE INDEX "ORDERS_customer_id_event_id_idx" ON "ORDERS"("customer_id", "event_id");

-- CreateIndex
CREATE INDEX "ORDERTICKETS_order_id_ticket_id_idx" ON "ORDERTICKETS"("order_id", "ticket_id");

-- CreateIndex
CREATE INDEX "TICKETS_event_id_idx" ON "TICKETS"("event_id");

-- CreateIndex
CREATE INDEX "USERS_email_idx" ON "USERS"("email");
