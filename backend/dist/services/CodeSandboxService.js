"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeSandboxService = void 0;
const vm_1 = __importDefault(require("vm"));
class CodeSandboxService {
    /**
     * Executa o código JavaScript do aluno para um dado input.
     */
    static executeJavaScript(code, input, expectedOutput) {
        try {
            const args = input.trim().split(/\s+/).join(", ");
            const wrapperCode = `
        ${code}
        if (typeof solution === 'function') {
          solution(${args});
        } else {
          throw new Error("Você precisa criar uma função chamada 'solution' que retorne o resultado.");
        }
      `;
            // Executa o script com um timeout de 2 segundos para evitar loops infinitos
            const sandbox = {
                console: { log: () => { } }, // Evita console logs perigosos
                Math,
                String,
                Array,
                Number,
                Boolean,
                Object,
            };
            vm_1.default.createContext(sandbox);
            const rawResult = vm_1.default.runInContext(wrapperCode, sandbox, {
                timeout: 2000,
            });
            // Convertendo o resultado para string para comparar com o expectedOutput
            const actualOutput = String(rawResult).trim();
            const expectedOutputStr = String(expectedOutput).trim();
            const passed = actualOutput === expectedOutputStr;
            return {
                passed,
                actualOutput,
            };
        }
        catch (error) {
            return {
                passed: false,
                actualOutput: "",
                error: error.message || "Erro durante a execução do código.",
            };
        }
    }
    /**
     * Ponto de entrada para executar o código de acordo com a linguagem.
     */
    static execute(language, code, input, expectedOutput) {
        if (language === "javascript") {
            return this.executeJavaScript(code, input, expectedOutput);
        }
        // Suporte a Python (mock) para o MVP sem Docker
        if (language === "python") {
            return {
                passed: false,
                actualOutput: "",
                error: "A execução de código Python ainda não é suportada nesta versão.",
            };
        }
        return {
            passed: false,
            actualOutput: "",
            error: `Linguagem ${language} não suportada.`,
        };
    }
}
exports.CodeSandboxService = CodeSandboxService;
