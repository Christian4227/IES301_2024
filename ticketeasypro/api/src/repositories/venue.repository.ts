import { PaginationParams } from "@interfaces/common.interface";
import prisma from "./prisma";

import { Prisma } from "@prisma/client";
import { paginate } from "@utils/paginate";

import { PaginateParams } from "types/common.type";

import { Venue } from "@interfaces/venue.interface";


class VenueRepository {
  private eventDb: Prisma.VenueDelegate;
  constructor() {
    this.eventDb = prisma.venue;
  }

  // create = async (eventCreate: RepoEventCreate): Promise<BaseEvent> => {
  //   const { category_id, manager_id, location_id, ...rest } = eventCreate;

  //   const event = await this.eventDb.create({
  //     data: {
  //       ...rest,
  //       category: { connect: { id: category_id } },
  //       event_manager: { connect: { id: manager_id } },
  //       location: { connect: { id: location_id } }
  //     }
  //   });
  //   return event;

  // };

  // find = async (identifier: number): Promise<BaseEvent> => {
  //   const event = await this.eventDb.findUnique({
  //     where: { id: identifier },
  //     select: {
  //       id: true, name: true, description: true, initial_date: true, final_date: true, status: true,
  //       base_price: true, capacity: true, img_banner: true, img_thumbnail: true, color: true, category_id: true,
  //       manager_id: true, location_id: true
  //     }
  //   });
  //   if (!event) throw new Error(`Event id: ${identifier} not found.`);
  //   return event
  // };
  // findDetails = async (identifier: number): Promise<EventUniqueResult> => {
  //   const whereClause = { id: identifier };

  //   const event = await this.eventDb.findUnique({
  //     where: whereClause,
  //     select: {
  //       id: true,
  //       name: true, description: true, initial_date: true, final_date: true, status: true,
  //       base_price: true, capacity: true, img_banner: true, img_thumbnail: true, color: true,
  //       category: { select: { id: true, name: true, description: true } },
  //       location: {
  //         select: {
  //           id: true, name: true, address_type: true, address: true, number: true, zip_code: true,
  //           city: true, uf: true, country: true, complements: true
  //         }
  //       }, manager_id: true //, Ticket: true
  //     }
  //   });

  //   if (!event) throw new Error(`Event id: ${identifier} not found.`);
  //   return event;
  // };

  // update = async (identifier: number, data: RepoEventUpdate): Promise<BaseEvent> => {
  //   const whereClause = { id: identifier };
  //   const filteredData = filterNullsData(data);

  //   const eventUpdated = await this.eventDb.update({
  //     where: whereClause,
  //     data: filteredData
  //   });
  //   return eventUpdated;
  // };
  findDetails = async (venueId: number) => {
    return this.eventDb.findUnique({ where: { id: venueId } });
  };
  findEvents = async (paginationParams: PaginationParams, orderBy: Prisma.VenueOrderByWithRelationInput[] = [{ name: "asc" }]) => {
    // Inicializando o whereClause com a condição de data
    // let whereClause: Prisma.EventWhereInput = { AND: { location: location, initial_date: { gte: startDate }, final_date: { lte: endDate } } };
    let whereClause: Prisma.VenueWhereInput = {};
    // console.log({ query, startDate, endDate, category_id, status });
    paginationParams.page = 1
    paginationParams.pageSize = 1000
    // if (query) {
    //   whereClause = ({
    //     ...whereClause,
    //     OR: [
    //       { name: { contains: query, mode: 'insensitive' } },
    //       { description: { contains: query, mode: 'insensitive' } }
    //     ]
    //   });
    // };
    const select: Prisma.VenueSelect = {
      id: true, name: true, address_type: true, address: true, number: true, zip_code: true,
      city: true, uf: true, country: true, complements: true, latitude: true, longitude: true,
    }


    // Parâmetros de paginação incluindo orderBy
    const paginateParams: PaginateParams<Prisma.VenueDelegate, Prisma.VenueWhereInput, Prisma.VenueOrderByWithRelationInput[]> = {
      model: this.eventDb,
      where: whereClause,
      paginationParams,
      select,
      orderBy
    };


    const paginated = await paginate<Venue, Prisma.VenueWhereInput, Prisma.VenueOrderByWithRelationInput[], typeof this.eventDb>(paginateParams);
    return paginated;
  }
}
export default VenueRepository;