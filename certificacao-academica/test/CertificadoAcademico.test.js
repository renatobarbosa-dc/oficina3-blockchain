const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificadoAcademico", function () {
  let contrato, instituicao, coordenacao, aluno, terceiroNaoAutorizado;

  beforeEach(async function () {
    [instituicao, coordenacao, aluno, terceiroNaoAutorizado] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("CertificadoAcademico");
    contrato = await Factory.deploy();
    await contrato.waitForDeployment();
  });

  it("deve definir a instituicao como owner e emissor autorizado inicial", async function () {
    expect(await contrato.instituicao()).to.equal(instituicao.address);
    expect(await contrato.emissoresAutorizados(instituicao.address)).to.equal(true);
  });

  it("instituicao deve conseguir autorizar um novo emissor", async function () {
    await expect(contrato.connect(instituicao).autorizarEmissor(coordenacao.address))
      .to.emit(contrato, "EmissorAutorizado")
      .withArgs(coordenacao.address);

    expect(await contrato.emissoresAutorizados(coordenacao.address)).to.equal(true);
  });

  it("NAO deve permitir que um endereco qualquer autorize emissores (operacao invalida)", async function () {
    await expect(
      contrato.connect(terceiroNaoAutorizado).autorizarEmissor(coordenacao.address)
    ).to.be.revertedWith("Somente a instituicao pode executar esta acao");
  });

  it("emissor autorizado deve conseguir emitir um certificado valido", async function () {
    await contrato.connect(instituicao).autorizarEmissor(coordenacao.address);

    const hash = ethers.keccak256(ethers.toUtf8Bytes("certificado-do-renato-v1"));

    await expect(
      contrato.connect(coordenacao).emitirCertificado(aluno.address, hash, "Engenharia da Computacao")
    )
      .to.emit(contrato, "CertificadoEmitido")
      .withArgs(1, aluno.address, coordenacao.address, hash);

    const c = await contrato.verificarCertificado(1);
    expect(c.aluno).to.equal(aluno.address);
    expect(c.valido).to.equal(true);
  });

  it("NAO deve permitir emissao por endereco nao autorizado (operacao invalida)", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("certificado-fraude"));

    await expect(
      contrato.connect(terceiroNaoAutorizado).emitirCertificado(aluno.address, hash, "Curso X")
    ).to.be.revertedWith("Endereco nao autorizado a emitir certificados");
  });

  it("NAO deve permitir emitir dois certificados com o mesmo hash (entrada invalida)", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("certificado-duplicado"));
    await contrato.connect(instituicao).emitirCertificado(aluno.address, hash, "Curso X");

    await expect(
      contrato.connect(instituicao).emitirCertificado(aluno.address, hash, "Curso X")
    ).to.be.revertedWith("Ja existe certificado com este hash");
  });

  it("instituicao ou emissor original devem conseguir revogar um certificado", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("certificado-revogavel"));
    await contrato.connect(instituicao).emitirCertificado(aluno.address, hash, "Curso X");

    await expect(contrato.connect(instituicao).revogarCertificado(1))
      .to.emit(contrato, "CertificadoRevogado")
      .withArgs(1, instituicao.address);

    const c = await contrato.verificarCertificado(1);
    expect(c.valido).to.equal(false);
  });

  it("NAO deve permitir que terceiro sem permissao revogue um certificado (operacao sem permissao)", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("certificado-protegido"));
    await contrato.connect(instituicao).emitirCertificado(aluno.address, hash, "Curso X");

    await expect(
      contrato.connect(terceiroNaoAutorizado).revogarCertificado(1)
    ).to.be.revertedWith("Sem permissao para revogar este certificado");
  });

  it("deve permitir consultar um certificado pelo hash do documento", async function () {
    const hash = ethers.keccak256(ethers.toUtf8Bytes("certificado-consulta"));
    await contrato.connect(instituicao).emitirCertificado(aluno.address, hash, "Curso X");

    const id = await contrato.idPorHash(hash);
    expect(id).to.equal(1);
  });

  it("consulta de certificado inexistente deve reverter (entrada invalida)", async function () {
    await expect(contrato.verificarCertificado(999)).to.be.revertedWith("Certificado nao existe");
  });
});
