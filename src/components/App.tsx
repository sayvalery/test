import {
  createNavigator,
  useBackButtonIntegration,
  useNavigatorIntegration,
} from '@tma.js/react-router-integration';
import { useBackButton } from '@tma.js/sdk-react';
import { type FC, useMemo } from 'react';
import {
  Navigate,
  Route,
  Router,
  Routes,
} from 'react-router-dom';

import React from 'react';
import { useInitData } from '@tma.js/sdk-react';



import { routes } from '~/navigation/routes.tsx';


const operationName = "storefrontGetApartmentsList";
const variables = {
  companyUuid: "3818382c-c9a4-48f9-908f-f8a85a93648f",
  criteria: {
    state: []
  },
  limit: 30,
  offset: 0,
  sort: {
    field: "cost",
    order: "ASC"
  }
};

const operationName2 = "getLoanOffer";
const variables2 = {
  age: 30,
  loanPeriod: 30,
  agendaType: "primary_housing",
  isRfCitizen: true,
  housingComplexUuid: "ed2f5053-a52c-4398-9226-a57d05a34e9b",
  initialPayment: "15000000",
  cost: "30000000",
  mortgageType: "STANDARD"
};


const query = `query storefrontGetApartmentsList($companyUuid: UUID, $criteria: StorefrontApartmentCriteriaInput, $limit: Int, $offset: Int, $sort: Sort) {
  result: storefrontGetApartmentsList(
    companyUuid: $companyUuid
    criteria: $criteria
    limit: $limit
    offset: $offset
    sort: $sort
  ) {
    collection {
      ...StorefrontRealEstateList
      __typename
    }
    maxBuildDate
    maxCost
    maxFloor
    maxSquare
    minCost
    minFloor
    minSquare
    total
    __typename
  }
}

fragment StorefrontRealEstateList on StorefrontRealEstateList {
  apartment {
    ...StorefrontApartment
    __typename
  }
  bookingExpiresAt
  companyUuid
  cost
  externalId
  housingComplexUuid
  housingComplexName
  housingUuid
  layoutPhoto
  layoutUuid
  name
  number
  square
  state
  status
  costPerSquare
  housingBuildDate
  housingNumber
  type
  storeroom {
    ...StorefrontStoreroom
    __typename
  }
  parking {
    ...StorefrontParking
    __typename
  }
  uuid
  housingFloorsCount
  __typename
}

fragment StorefrontApartment on StorefrontApartment {
  balconiesCount
  combinedWcsCount
  finishCondition
  flatNumber
  floor
  isApartments
  isEuroFlat
  isPenthouse
  kitchenArea
  loggiasCount
  roomsCount
  separateWcsCount
  unitNumber
  windowsView
  __typename
}

fragment StorefrontStoreroom on StorefrontStoreroom {
  floor
  isCamera
  isHeating
  isSecurity
  __typename
}

fragment StorefrontParking on StorefrontParking {
  floor
  isCamera
  isElectricity
  isHeating
  isSecurity
  __typename
}`;

const query2 = `query getLoanOffer($age: Int, $loanPeriod: Int, $agendaType: LoanPurpose, $isRfCitizen: Boolean, $housingComplexUuid: UUID, $initialPayment: BigInt, $cost: BigInt!, $mortgageType: MortgageType) {
  getLoanOffer(age: $age, loanPeriod: $loanPeriod, agendaType: $agendaType, isRfCitizen: $isRfCitizen, housingComplexUuid: $housingComplexUuid, initialPayment: $initialPayment, cost: $cost, mortgageType: $mortgageType) {
    id,
    name,
    bankId,
    bankName,
    bankLogo,
    rate,
    recommendedIncomeCoeff,
    periods {
      period, 
      amount
    },
    minInitialPayment,
    maxCreditPeriod,
    maxCreditAmount,
    minOverallExp,
    minAge,
    minLastJobExp,
    maxAge,
    realtyCostIncreasePercent,
    periodParams{
      months,
      rate,
      monthlyPayment
    },
    strictlyMatchesLoanPeriod
  }
}`;


let query1Result;
let query2Result;
let products;
let aparts;


fetch('https://gql.dvizh.tech/gql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query,
    variables,
  }),
})
.then(response => response.json())
.then(data => {

  query1Result = data;
  aparts = query1Result.data.result.collection.map(apart => ({
    id: apart.externalId,
    title: apart.name,
    description: apart.square,
    price: apart.cost, 
  }));
  console.log('Квартиры:');
  console.log(aparts);
});

fetch('https://gql.dvizh.tech/gql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    operationName: operationName2,
    query: query2,
    variables: variables2,
  }),
})
.then(response => response.json())
.then(data => {
  query2Result = data;
  products = query2Result.data.getLoanOffer.map(offer => ({
    id: offer.id.toString(),
    title: offer.name,
    description: offer.bankName,
    price: offer.rate,
  }));
  console.log('Кредиты:');
  console.log(products);
});





export const App: FC = () => {

  const { user } = useInitData();

  return (
    <div>
      <h1>Hello, {user?.firstName}</h1>
      {/* Rest of your component */}
    </div>
  );
  // const tmaNavigator = useMemo(createNavigator, []);
  // const [location, navigator] = useNavigatorIntegration(tmaNavigator);
  // const backButton = useBackButton();

  // useBackButtonIntegration(tmaNavigator, backButton);

  // return (
    
  //   <Router location={location} navigator={navigator}>
  //     <h1>Hello, {user?.firstName}</h1>
  //     <Routes>
  //       {routes.map((route) => <Route key={route.path} {...route} />)}
  //       <Route path="*" element={<Navigate to="/" />} />
  //     </Routes>
  //   </Router>
  // );
};

export default App;