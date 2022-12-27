import { gql } from '@apollo/client'

export function missionsQuery(limit = 3, sort = '-launch_date_local') {
  return gql`
  query GetMissions {
    launchesPast(limit: ${limit}, sort: "${sort}") {
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
      rocket {
        rocket_name
      }
    }
  }
`
}

export const ROCKETS = gql`
  query GetRockets {
    rockets {
      description
      active
      name
    }
  }
`
