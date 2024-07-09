
import { Prisma } from "@prisma/client";



import { PaginationParams } from "@interfaces/common.interface";

import VenueRepository from "src/repositories/venue.repository";

class VenueService {
	private venueRepository: VenueRepository;
	constructor() {
		this.venueRepository = new VenueRepository();
	}

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