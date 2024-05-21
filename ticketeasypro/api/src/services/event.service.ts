
import { EventStatus, Prisma } from "@prisma/client";
import { isValidDateRange } from "../utils/mixes";
import EventRepository from "./../repositories/event.repository";
import { BaseEvent, EventCreate, EventUpdateResult } from "@interfaces/event.interface";
import { PaginationParams, QueryIntervalDate } from "@interfaces/common.interface";
import { PaginatedEventResult, PartialEventUpdate } from "types/event.type";

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

	update = async (eventId: number, dataUpdate: PartialEventUpdate): Promise<EventUpdateResult> => {
		const filteredDataUpdate = this.filterNullsData(dataUpdate);
		eventId = Number(eventId);
		const eventStored: BaseEvent = await this.eventRepository.findDetails(eventId);
		const { ts_initial_date, ts_final_date, location_id, manager_id, category_id, ...rest } = filteredDataUpdate;
		let { status } = filteredDataUpdate
		const toBeUpdatedIntervalDates = resolveDates(eventStored, { ts_initial_date, ts_final_date });

		const { ts_initial_date: initial_date, ts_final_date: final_date } = toBeUpdatedIntervalDates
		const toUpdateData: any = rest;

		if (status && !Object.values(EventStatus).includes(status))
			throw new Error("Event status is invalid.");

			if (initial_date) toUpdateData.initial_date = new Date(initial_date);
		if (final_date) toUpdateData.final_date = new Date(final_date);
		if (manager_id) toUpdateData.event_manager = { connect: { id: manager_id } };
		if (category_id) toUpdateData.category = { connect: { id: category_id } };
		if (location_id) toUpdateData.location = { connect: { id: location_id } };

		const updatedEvent = await this.eventRepository.update(eventId, toUpdateData);


		return {
			...updatedEvent, ts_initial_date: updatedEvent.initial_date.getTime(), ts_final_date: updatedEvent.final_date.getTime()
		};
	}

	searchEvents = async (query: string,
		paginationParams: PaginationParams,
		queryIntervalDate: QueryIntervalDate,
		orderBy: Prisma.EventOrderByWithRelationInput[] = [{ name: "asc" }, { base_price: "desc" }, { initial_date: "desc" }, { final_date: "asc" }],
		status?: EventStatus,
		category_id?: number,
	): Promise<PaginatedEventResult> => {
		const auxDateNow = new Date();

		if (category_id) category_id = Number(category_id)

		if (paginationParams.page <= 0) throw new Error("The page is min equals 1.");

		if (paginationParams.pageSize > 20) throw new Error("The page-size is to largest.");

		let { tsStartDate, tsEndDate } = queryIntervalDate;

		// caso não tenha uma data final para filtrar o sistema irá tornar a data final o ulitmo dia do mês seguinte.
		const endDate = new Date(Date.UTC(auxDateNow.getUTCFullYear(), auxDateNow.getUTCMonth() + 2, 0, 0, 0, 0, 0));
		const startDate = new Date(Date.UTC(auxDateNow.getUTCFullYear(), auxDateNow.getUTCMonth(), auxDateNow.getUTCDate())
		);
		if (tsStartDate) startDate.setTime(Number(tsStartDate));
		if (tsEndDate) endDate.setTime(Number(tsEndDate));

		if (!isValidDateRange(startDate.getTime(), endDate.getTime()))
			throw new Error("The date range is invalid.");

		const paginatedEventResults: PaginatedEventResult = await this.eventRepository.findEvents(
			query, paginationParams, orderBy, startDate, endDate, status, category_id
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