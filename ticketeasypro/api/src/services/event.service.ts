
import { EventStatus, Prisma, TicketStatus } from "@prisma/client";
import { isValidDateRange } from "../utils/mixes";
import EventRepository from "./../repositories/event.repository";
import { BaseEvent, Event, EventCreate, EventResult, EventUpdateResult } from "@interfaces/event.interface";
import { PaginationParams, QueryIntervalDate } from "@interfaces/common.interface";
import { EventUniqueResult, PaginatedEventResult, PartialEventUpdate } from "types/event.type";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { integerRegex } from "@utils/validators";
import prisma from "src/repositories/prisma";

class EventService {
	private eventRepository: EventRepository;
	constructor() {
		this.eventRepository = new EventRepository();
	}
	create = async (actorId: string, eventCreate: EventCreate): Promise<BaseEvent> => {
		const { ts_final_date, ts_initial_date, ...rest } = eventCreate;

		if (!isValidDateRange(ts_initial_date, ts_final_date))
			throw new Error("The date range is invalid.");

		const initial_date = new Date(ts_initial_date);
		const final_date = new Date(ts_final_date);

		try {
			const eventCreated = await this.eventRepository.create({ ...rest, initial_date, final_date, manager_id: actorId });
			return eventCreated;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2025') {
					throw new Error(`A record with the provided IDs was not found. Please check the category_id, manager_id, and location_id.`);
				}
			}
			throw error; // Re-throw the error if it's not a known request error
		}

	}
	filterNullsData = (data: PartialEventUpdate): PartialEventUpdate => {
		return Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== null && value !== undefined));
	};

	cancel = async (eventId: number): Promise<EventUniqueResult> => {
		eventId = Number(eventId);
		// const eventStored: EventUniqueResult = await this.eventRepository.findDetails(eventId);

		const result = await prisma.$transaction(async (transaction) => {
			// Verificar se o TypeTicket existe
			const eventStored = await transaction.event.findUnique({ where: { id: eventId } });

			// Se o TypeTicket não existir, lançar um erro
			if (!eventStored) throw new Error(`Event id: ${eventStored} not found.`);

			const orderUpdated = await transaction.event.update({
				where: { id: eventStored.id },
				data: { status: EventStatus.CANCELLED }
			});
			await transaction.ticket.updateMany({
				where: { event_id: orderUpdated.id },
				data: { status: TicketStatus.CANCELLED },
			});
			return orderUpdated;
		});
		return this.getEvent(result.id);

	}

	modify = async (eventId: number, dataUpdate: PartialEventUpdate): Promise<EventUpdateResult> => {
		const filteredDataUpdate = this.filterNullsData(dataUpdate);
		eventId = Number(eventId);
		const eventStored: EventUniqueResult = await this.eventRepository.findDetails(eventId);
		const { ts_initial_date, ts_final_date, location_id, manager_id, category_id, status, ...rest } = filteredDataUpdate;

		const toBeUpdatedIntervalDates = resolveDates(eventStored, { ts_initial_date, ts_final_date });

		const { ts_initial_date: initial_date, ts_final_date: final_date } = toBeUpdatedIntervalDates
		const toUpdateData: any = { ...rest };

		if (status && !Object.values(EventStatus).includes(status))
			throw new Error("Event status is invalid.");

		if (initial_date) toUpdateData.initial_date = new Date(initial_date);
		if (final_date) toUpdateData.final_date = new Date(final_date);
		if (manager_id) toUpdateData.event_manager = { connect: { id: manager_id } };
		if (category_id) toUpdateData.category = { connect: { id: category_id } };
		if (location_id) toUpdateData.location = { connect: { id: location_id } };

		try {
			const updatedEvent = await this.eventRepository.update(eventId, toUpdateData);

			return {
				...updatedEvent, ts_initial_date: updatedEvent.initial_date.getTime(), ts_final_date: updatedEvent.final_date.getTime()
			};
		} catch (error) {
			console.error("Error in EventService.modify:", error); // Adicione logs para depuração
			if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
				const meta = error.meta as { target?: string[] }; // Adiciona um tipo explícito para meta
				const targetField = Array.isArray(meta?.target) ? meta.target.join(', ') : 'unknown field';
				throw new Error(`Field(s): "${targetField}" on Event must be unique.`);
			}
			throw error; // Lance novamente o erro original se for um tipo inesperado
		}


	};

	getEvent = async (eventId: number): Promise<EventUniqueResult> => {
		const event = this.eventRepository.findDetails(eventId)
		return event

	};

	searchEvents = async (
		paginationParams: PaginationParams,
		queryIntervalDate: QueryIntervalDate,
		orderBy: Prisma.EventOrderByWithRelationInput[] = [{ name: "asc" }, { base_price: "desc" }, { initial_date: "desc" }, { final_date: "asc" }],
		uf?: string[],
		query?: string,
		status?: EventStatus,
		category_id?: number,
		national: boolean = true,
	): Promise<PaginatedEventResult> => {

		let { page, pageSize } = paginationParams;

		if (category_id) category_id = Number(category_id)

		if (!(integerRegex.test(page.toString()) && integerRegex.test(page.toString())))
			throw new Error('Page and PageSize must be valid integer value.');

		paginationParams.page = Number(page);
		paginationParams.pageSize = Number(pageSize);

		if (paginationParams.page <= 0) throw new Error("The page is min equals 1.");
		if (paginationParams.pageSize > 20) throw new Error("The page-size is to largest.");

		let { tsStartDate, tsEndDate } = queryIntervalDate;
		const auxDateNow = new Date();
		// caso não tenha uma data inicial e/ou final para filtrar o sistema irá retorna da data atual
		// até o último dia do mês seguinte a data atual.

		const startDate: Date = auxDateNow;
		const endDate: Date = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + 2, 0, 0, 0, 0, 0));

		if (tsStartDate) {
			startDate.setTime(Number(tsStartDate))
			// caso tenha uma data inicial o sistema irá tornar a data final o último dia do mês seguinte a data informada
			endDate.setTime((new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth() + 2, 0, 0, 0, 0, 0))).getTime());
		}
		if (tsEndDate) endDate.setTime(tsEndDate)

		if (!isValidDateRange(startDate.getTime(), endDate.getTime()))
			throw new Error("The date range is invalid.");

		let location;
		if (national) {
			location = { country: 'BRASIL' }
			if (typeof uf === 'string')
				location = { ...location, uf: uf }
			if (Array.isArray(uf) && uf.length > 0)
				location = { ...location, uf: { in: uf.map((estado) => estado.toUpperCase()) } }
		}
		else
			location = { country: { not: 'BRASIL' } }

		const paginatedEventResults: PaginatedEventResult = await this.eventRepository.findEvents(
			paginationParams, orderBy, location, startDate, endDate, query, status, category_id
		);
		return paginatedEventResults;
	}
}
const resolveDates = (eventStored: { initial_date: Date, final_date: Date }, dataUpdate: PartialEventUpdate): PartialEventUpdate => {
	const toBeChanged: PartialEventUpdate = {};
	const ts_initial_date = dataUpdate.ts_initial_date ?? eventStored.initial_date.getTime();
	const ts_final_date = dataUpdate.ts_final_date ?? eventStored.final_date.getTime();

	if (ts_initial_date !== eventStored.initial_date.getTime()) {
		toBeChanged.ts_initial_date = ts_initial_date;
	}
	if (ts_final_date !== eventStored.final_date.getTime()) {
		toBeChanged.ts_final_date = ts_final_date;
	}

	if (ts_initial_date && ts_final_date && !isValidDateRange(ts_initial_date, ts_final_date)) {
		throw new Error("The desired date/time range is invalid.");
	}

	return toBeChanged;
}
export default EventService;