export const dataSendAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'data',
        type: 'string'
      }
    ],
    name: 'DataSet',
    type: 'event'
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
    payable: true
  },
  {
    stateMutability: 'payable',
    type: 'receive',
    payable: true
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_data',
        type: 'string'
      }
    ],
    name: 'setData',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
