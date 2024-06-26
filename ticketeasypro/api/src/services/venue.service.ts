
import { Prisma } from "@prisma/client";



import { PaginationParams } from "@interfaces/common.interface";

import VenueRepository from "src/repositories/venue.repository";

class VenueService {
	private venueRepository: VenueRepository;
	constructor() {
		this.venueRepository = new VenueRepository();
	}
	// create = async (actorId: string, eventCreate: EventCreate): Promise<BaseEvent> => {
	// 	const { ts_final_date, ts_initial_date, ...rest } = eventCreate;

	// 	if (!isValidDateRange(ts_initial_date, ts_final_date))
	// 		throw new Error("The date range is invalid.");

	// 	const initial_date = new Date(ts_initial_date);
	// 	const final_date = new Date(ts_final_date);

	// 	try {
	// 		const eventCreated = await this.venueRepository.create({ ...rest, initial_date, final_date, manager_id: actorId });
	// 		return eventCreated;
	// 	} catch (error) {
	// 		if (error instanceof Prisma.PrismaClientKnownRequestError) {
	// 			if (error.code === 'P2025') {
	// 				throw new Error(`A record with the provided IDs was not found. Please check the category_id, manager_id, and location_id.`);
	// 			}
	// 		}
	// 		throw error; // Re-throw the error if it's not a known request error
	// 	}

	// }
	// filterNullsData = (data: PartialEventUpdate): PartialEventUpdate => {
	// 	return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null && value !== undefined));
	// };

	// cancel = async (eventId: number): Promise<EventUniqueResult> => {
	// 	eventId = Number(eventId);
	// 	// const eventStored: EventUniqueResult = await this.venueRepository.findDetails(eventId);

	// 	const result = await prisma.$transaction(async (transaction) => {
	// 		// Verificar se o TypeTicket existe
	// 		const eventStored = await transaction.event.findUnique({ where: { id: eventId } });

	// 		// Se o TypeTicket não existir, lançar um erro
	// 		if (!eventStored) throw new Error(`Event id: ${eventStored} not found.`);

	// 		const orderUpdated = await transaction.event.update({
	// 			where: { id: eventStored.id },
	// 			data: { status: EventStatus.CANCELLED }
	// 		});
	// 		await transaction.ticket.updateMany({
	// 			where: { event_id: orderUpdated.id },
	// 			data: { status: TicketStatus.CANCELLED },
	// 		});
	// 		return orderUpdated;
	// 	});
	// 	return this.getEvent(result.id);

	// }

	// modify = async (eventId: number, dataUpdate: PartialEventUpdate): Promise<EventUpdateResult> => {
	// 	const filteredDataUpdate = this.filterNullsData(dataUpdate);
	// 	eventId = Number(eventId);
	// 	const eventStored: EventUniqueResult = await this.eventRepository.findDetails(eventId);
	// 	const { ts_initial_date, ts_final_date, location_id, manager_id, category_id, status, ...rest } = filteredDataUpdate;

	// 	const toBeUpdatedIntervalDates = resolveDates(eventStored, { ts_initial_date, ts_final_date });

	// 	const { ts_initial_date: initial_date, ts_final_date: final_date } = toBeUpdatedIntervalDates
	// 	const toUpdateData: any = { ...rest };

	// 	if (status && !Object.values(EventStatus).includes(status))
	// 		throw new Error("Event status is invalid.");

	// 	if (initial_date) toUpdateData.initial_date = new Date(initial_date);
	// 	if (final_date) toUpdateData.final_date = new Date(final_date);
	// 	if (manager_id) toUpdateData.event_manager = { connect: { id: manager_id } };
	// 	if (category_id) toUpdateData.category = { connect: { id: category_id } };
	// 	if (location_id) toUpdateData.location = { connect: { id: location_id } };

	// 	try {
	// 		const updatedEvent = await this.eventRepository.update(eventId, toUpdateData);

	// 		return {
	// 			...updatedEvent, ts_initial_date: updatedEvent.initial_date.getTime(), ts_final_date: updatedEvent.final_date.getTime()
	// 		};
	// 	} catch (error) {
	// 		console.error("Error in EventService.modify:", error); // Adicione logs para depuração
	// 		if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
	// 			const meta = error.meta as { target?: string[] }; // Adiciona um tipo explícito para meta
	// 			const targetField = Array.isArray(meta?.target) ? meta.target.join(', ') : 'unknown field';
	// 			throw new Error(`Field(s): "${targetField}" on Event must be unique.`);
	// 		}
	// 		throw error; // Lance novamente o erro original se for um tipo inesperado
	// 	}


	// };

	getVenue = async (venueId: number) => {
		const event = this.venueRepository.findDetails(Number(venueId))
		return event;
	};

	searchEvents = async (paginationParams: PaginationParams, orderBy: Prisma.VenueOrderByWithRelationInput[] = [{ name: "asc" }]) => {
		const paginatedVenueResults = await this.venueRepository.findEvents(paginationParams, orderBy);
		return paginatedVenueResults;
	}
}

export default VenueService;