// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title CertificadoAcademico
/// @notice Registra e verifica certificados academicos de forma auditavel e imutavel.
/// @dev Apenas o hash do documento e metadados minimos ficam on-chain;
///      dados pessoais (nome do aluno, PDF, etc.) ficam fora da blockchain.
contract CertificadoAcademico {
    address public instituicao;

    struct Certificado {
        bytes32 hashDocumento;   // hash do PDF/arquivo do certificado (fora da chain)
        address emissor;         // endereco que emitiu (ex: coordenacao do curso)
        address aluno;           // endereco do aluno (identificador, sem dado pessoal)
        string curso;            // nome do curso (opcional, avaliem se querem deixar off-chain)
        uint256 timestamp;       // data de emissao
        bool valido;             // false = revogado
    }

    uint256 private _proximoId;
    mapping(uint256 => Certificado) private _certificados;
    mapping(bytes32 => uint256) private _idPorHash; // hash => id (0 = nao existe)
    mapping(address => bool) public emissoresAutorizados;

    event EmissorAutorizado(address indexed emissor);
    event EmissorRevogado(address indexed emissor);
    event CertificadoEmitido(
        uint256 indexed id,
        address indexed aluno,
        address indexed emissor,
        bytes32 hashDocumento
    );
    event CertificadoRevogado(uint256 indexed id, address indexed revogadoPor);

    modifier apenasInstituicao() {
        require(msg.sender == instituicao, "Somente a instituicao pode executar esta acao");
        _;
    }

    modifier apenasEmissorAutorizado() {
        require(emissoresAutorizados[msg.sender], "Endereco nao autorizado a emitir certificados");
        _;
    }

    constructor() {
        instituicao = msg.sender;
        // a instituicao ja nasce como emissora autorizada
        emissoresAutorizados[msg.sender] = true;
        emit EmissorAutorizado(msg.sender);
    }

    /// @notice Autoriza um novo endereco (ex: coordenacao de curso) a emitir certificados.
    function autorizarEmissor(address emissor) external apenasInstituicao {
        require(emissor != address(0), "Endereco invalido");
        require(!emissoresAutorizados[emissor], "Emissor ja autorizado");
        emissoresAutorizados[emissor] = true;
        emit EmissorAutorizado(emissor);
    }

    /// @notice Revoga a autorizacao de um emissor.
    function revogarAutorizacaoEmissor(address emissor) external apenasInstituicao {
        require(emissoresAutorizados[emissor], "Emissor nao esta autorizado");
        emissoresAutorizados[emissor] = false;
        emit EmissorRevogado(emissor);
    }

    /// @notice Emite um novo certificado. Retorna o id gerado.
    function emitirCertificado(
        address aluno,
        bytes32 hashDocumento,
        string calldata curso
    ) external apenasEmissorAutorizado returns (uint256) {
        require(aluno != address(0), "Endereco do aluno invalido");
        require(hashDocumento != bytes32(0), "Hash do documento invalido");
        require(_idPorHash[hashDocumento] == 0, "Ja existe certificado com este hash");

        _proximoId += 1;
        uint256 id = _proximoId;

        _certificados[id] = Certificado({
            hashDocumento: hashDocumento,
            emissor: msg.sender,
            aluno: aluno,
            curso: curso,
            timestamp: block.timestamp,
            valido: true
        });
        _idPorHash[hashDocumento] = id;

        emit CertificadoEmitido(id, aluno, msg.sender, hashDocumento);
        return id;
    }

    /// @notice Revoga um certificado existente. Apenas a instituicao ou o emissor original.
    function revogarCertificado(uint256 id) external {
        Certificado storage c = _certificados[id];
        require(c.timestamp != 0, "Certificado nao existe");
        require(c.valido, "Certificado ja esta revogado");
        require(
            msg.sender == instituicao || msg.sender == c.emissor,
            "Sem permissao para revogar este certificado"
        );

        c.valido = false;
        emit CertificadoRevogado(id, msg.sender);
    }

    /// @notice Consulta um certificado pelo id.
    function verificarCertificado(uint256 id)
        external
        view
        returns (
            bytes32 hashDocumento,
            address emissor,
            address aluno,
            string memory curso,
            uint256 timestamp,
            bool valido
        )
    {
        Certificado storage c = _certificados[id];
        require(c.timestamp != 0, "Certificado nao existe");
        return (c.hashDocumento, c.emissor, c.aluno, c.curso, c.timestamp, c.valido);
    }

    /// @notice Consulta o id de um certificado a partir do hash do documento. Retorna 0 se nao existir.
    function idPorHash(bytes32 hashDocumento) external view returns (uint256) {
        return _idPorHash[hashDocumento];
    }

    /// @notice Total de certificados emitidos ate agora.
    function totalCertificados() external view returns (uint256) {
        return _proximoId;
    }
}
