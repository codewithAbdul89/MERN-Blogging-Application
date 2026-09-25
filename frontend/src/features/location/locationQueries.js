import { useQuery } from "@tanstack/react-query";

import {
  getCountries,
  getStatesOfCountry,
  getCitiesOfState,
} from "@countrystatecity/countries-browser";
import { QUERY_KEYS } from "../../constants/queryKeys";

// Countries

export const useCountries = () => {
  return useQuery({
    queryKey: QUERY_KEYS.countries,

    queryFn: async () => {
      const countries = await getCountries();

      return countries;
    },

    staleTime: Infinity,

    retry: 1,
  });
};

// States / Provinces

export const useStates = (countryCode) => {
  return useQuery({
    queryKey: QUERY_KEYS.states(countryCode),

    queryFn: async () => {
      if (!countryCode) {
        return [];
      }

      return await getStatesOfCountry(countryCode);
    },

    enabled: Boolean(countryCode),

    staleTime: Infinity,

    retry: 1,
  });
};

// Cities

export const useCities = ({ countryCode, stateCode }) => {
  return useQuery({
    queryKey: QUERY_KEYS.cities(countryCode, stateCode),

    queryFn: async () => {
      if (!countryCode || !stateCode) {
        return [];
      }

      return await getCitiesOfState(countryCode, stateCode);
    },

    enabled: Boolean(countryCode && stateCode),

    staleTime: Infinity,

    retry: 1,
  });
};
