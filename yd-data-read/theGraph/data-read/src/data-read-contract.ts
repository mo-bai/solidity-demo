import { DataSet as DataSetEvent } from "../generated/DataReadContract/DataReadContract"
import { DataSet } from "../generated/schema"

export function handleDataSet(event: DataSetEvent): void {
  let entity = new DataSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.data = event.params.data

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
