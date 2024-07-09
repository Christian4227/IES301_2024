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