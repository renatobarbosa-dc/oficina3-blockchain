// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const CertificadoAcademico = await hre.ethers.getContractFactory("CertificadoAcademico");
  const contrato = await CertificadoAcademico.deploy();
  await contrato.waitForDeployment();

  const endereco = await contrato.getAddress();
  console.log("CertificadoAcademico implantado em:", endereco);

  // salva o endereco num arquivo simples (referencia rapida)
  fs.writeFileSync(
    "./deployed-address.json",
    JSON.stringify({ address: endereco }, null, 2)
  );

  // gera o config.js que a interface (frontend/index.html) consome diretamente,
  // com o endereco do contrato e o ABI - assim nao precisa copiar nada na mao
  const artifact = await hre.artifacts.readArtifact("CertificadoAcademico");
  const configContent =
    "// Gerado automaticamente por scripts/deploy.js - nao editar manualmente\n" +
    `const CONTRACT_ADDRESS = "${endereco}";\n` +
    `const CONTRACT_ABI = ${JSON.stringify(artifact.abi, null, 2)};\n`;

  const frontendDir = path.join(__dirname, "..", "frontend");
  fs.writeFileSync(path.join(frontendDir, "config.js"), configContent);
  console.log("frontend/config.js atualizado.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
