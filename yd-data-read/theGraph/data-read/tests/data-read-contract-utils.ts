import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import { DataSet } from "../generated/DataReadContract/DataReadContract"

export function createDataSetEvent(user: Address, data: string): DataSet {
  let dataSetEvent = changetype<DataSet>(newMockEvent())

  dataSetEvent.parameters = new Array()

  dataSetEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  dataSetEvent.parameters.push(
    new ethereum.EventParam("data", ethereum.Value.fromString(data))
  )

  return dataSetEvent
}
