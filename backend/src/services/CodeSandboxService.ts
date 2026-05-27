import vm from "vm";

export interface ExecutionResult {
  passed: boolean;
  actualOutput: string;
  error?: string;
}

export class CodeSandboxService {
  /**
   * Executa o código JavaScript do aluno para um dado input.
   */
  static executeJavaScript(
    code: string,
    input: string,
    expectedOutput: string,
  ): ExecutionResult {
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
        console: { log: () => {} }, // Evita console logs perigosos
        Math,
        String,
        Array,
        Number,
        Boolean,
        Object,
      };

      vm.createContext(sandbox);
      const rawResult = vm.runInContext(wrapperCode, sandbox, {
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
    } catch (error: any) {
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
  static execute(
    language: string,
    code: string,
    input: string,
    expectedOutput: string,
  ): ExecutionResult {
    if (language === "javascript") {
      return this.executeJavaScript(code, input, expectedOutput);
    }

    // Suporte a Python (mock) para o MVP sem Docker
    if (language === "python") {
      return {
        passed: false,
        actualOutput: "",
        error:
          "A execução de código Python ainda não é suportada nesta versão.",
      };
    }

    return {
      passed: false,
      actualOutput: "",
      error: `Linguagem ${language} não suportada.`,
    };
  }
}
