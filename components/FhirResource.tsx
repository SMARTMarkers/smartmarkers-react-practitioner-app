import React from "react";
import { Spinner } from "native-base";
import {
  QuestionnaireResponse,
  FhirResourceView,
} from "../smartmarkers-router";
import { useSelector } from "react-redux";
import { Store } from "../store/models";

interface RouteParams {
  reportId: string;
}

const FhirResource: React.FC<any> = () => {
  const selectedReport = useSelector(
    (store: Store) => store.root.selectedReport
  );

  if (!selectedReport) return <Spinner />;

  return (
    <FhirResourceView response={selectedReport as QuestionnaireResponse} />
  );
};

export default FhirResource;
