import React, { useState, useEffect } from 'react';
import EventFilter from "@components/EventFilter/EventFilter";
import client from "@/utils/client_axios"

const convertToQueryString = (filter) => {
  const queryParams = [];

  if (filter.searchTerm)
    queryParams.push(`filter=${encodeURIComponent(filter.searchTerm)}`);

  if (filter.period.start)
    queryParams.push(`start-date=${encodeURIComponent(new Date(filter.period.start).getTime())}`);

  if (filter.period.end)
    queryParams.push(`end-date=${encodeURIComponent(new Date(filter.period.end).getTime())}`);

  if (filter.category)
    queryParams.push(`category=${encodeURIComponent(filter.category)}`);

  if (filter.page)
    queryParams.push(`page=${encodeURIComponent(filter.page)}`);

  if (filter.pageSize)
    queryParams.push(`page=${encodeURIComponent(filter.pageSize)}`);

  if (filter?.status)
    queryParams.push(`status=${encodeURIComponent(filter.status)}`);
  else
    queryParams.push("status=PLANNED");

  if (filter.location.national) {
    queryParams.push("country=BRASIL");
    if (filter.location?.state)
      queryParams.push(`uf=${encodeURIComponent(filter.location.state)}`);
  }


  return `?${queryParams.join('&')}`;
};

const getCategories = async () => {
  const response = await client.get(`/categories`);
  const { data: { data: arrayCategories } } = response;
  return arrayCategories;
};

const getEvents = async (filter, setEventData) => {
  const url = convertToQueryString(filter);

  const response = await client.get(`/events/${url}`);
  let eventData = []
  if (response.status === 200)
    eventData = [...response.data.data]

  console.log(response)
  return response;
}
const TestEventFilter = () => {
  const [events, setEvents] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setFilteredCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFilterSubmit = async (filter) => {
    try {
      const response = await getEvents(filter);
      setEvents(response.data.data);
      console.log('Filter data:', filter);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <EventFilter arrayCategories={filteredCategories} onSubmit={handleFilterSubmit} />
  );
};

export default TestEventFilter;