
import { EventStatus, Prisma, Role } from "@prisma/client";
import { isValidDateRange } from "../utils/mixes";
import EventRepository from "./../repositories/event.repository";
import { BaseEvent, EventCreate, EventUpdate, EventUpdateResult } from "@interfaces/event.interface";
import { PaginationParams, QueryIntervalDate } from "@interfaces/common.interface";
import { PaginatedEventResult } from "types/event.type";

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


		const eventCreated = await this.eventRepository.create({ ...rest, initial_date, final_date, manager_id: actorId });
		return eventCreated;
	}

	update = async (eventID: number, dataUpdate: EventUpdate): Promise<EventUpdateResult> => {
		const { ts_initial_date, ts_final_date, status: statusToUpdate } = dataUpdate;
		const eventStored = await this.eventRepository.findDetails(eventID);


		if (!isValidDateRange(ts_initial_date, ts_final_date)) throw new Error("The date range is invalid.");


		try {
			const event: BaseEvent = await this.eventRepository.update(eventID, dataUpdate);
			return { ...event, ts_initial_date, ts_final_date };
		} catch (error) {
			throw error;
		}
	}

	searchEvents = async (query: string,
		paginationParams: PaginationParams,
		queryIntervalDate: QueryIntervalDate,
		orderBy: Prisma.EventOrderByWithRelationInput[] = [{ name: "asc" }, { base_price: "desc" }, { initial_date: "desc" }, { final_date: "asc" }],
		status?: EventStatus,
		category_id?: number,
	): Promise<PaginatedEventResult> => {

		paginationParams.pageSize = Number(paginationParams.pageSize) || 10;
		paginationParams.page = Number(paginationParams.page) || 1;

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
export default EventService;