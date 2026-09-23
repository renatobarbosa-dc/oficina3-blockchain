// Gerado automaticamente por scripts/deploy.js - nao editar manualmente
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "aluno",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "emissor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "hashDocumento",
        "type": "bytes32"
      }
    ],
    "name": "CertificadoEmitido",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "revogadoPor",
        "type": "address"
      }
    ],
    "name": "CertificadoRevogado",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "emissor",
        "type": "address"
      }
    ],
    "name": "EmissorAutorizado",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "emissor",
        "type": "address"
      }
    ],
    "name": "EmissorRevogado",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "emissor",
        "type": "address"
      }
    ],
    "name": "autorizarEmissor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "emissoresAutorizados",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "aluno",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "hashDocumento",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "curso",
        "type": "string"
      }
    ],
    "name": "emitirCertificado",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hashDocumento",
        "type": "bytes32"
      }
    ],
    "name": "idPorHash",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "instituicao",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "emissor",
        "type": "address"
      }
    ],
    "name": "revogarAutorizacaoEmissor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "revogarCertificado",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalCertificados",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "verificarCertificado",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "hashDocumento",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "emissor",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "aluno",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "curso",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "valido",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
