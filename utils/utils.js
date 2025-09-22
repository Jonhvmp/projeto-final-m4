import { response } from "express";

/**
 * valida e converte ID para número inteiro
 * @param {string} id - a ser validado
 * @returns {object} { isValid: boolean, parsedId: number|null, error: string|null }
 */
export const validateId = (id) => {
  const parseId = parseInt(id);

  if (isNaN(parseId) || parseId <= 0) {
    return {
      isValid: false,
      parsedId: null,
      error: "ID deve ser um número válido e maior que zero"
    };
  }

  return {
    isValid: true,
    parsedId: parseId,
    error: null
  };
};
/**
 * busca item por ID em alguma array!
 * @param {Array} array
 * @param {number} id
 * @param {string} itemName - nome do item (para mensagens de erro)
 * @returns {object} { found: boolean, item: object|null, index: number, error: string|null }
 */
export const findItemById = (array, id, itemName = "Item") => {
  const index = array.findIndex(item => item.id === id);

  if (index === -1) {
    return {
      found: false,
      item: null,
      index: -1,
      error: `${itemName} com ID ${id} não encontrado`
    };
  }

  return {
    found: true,
    item: array[index],
    index,
    error: null
  };
};

/**
 * gera proximo ID unique na array
 * @param {Array} array
 * @returns {number} próximo ID disponível
 */
export const generateNextId = (array) => {
  if (array.length === 0) return 1;
  return Math.max(...array.map(item => item.id)) + 1;
}
/**
 * cria resposta padrão de erro
 * @param {number} statusCode (HTTP)
 * @param {string} message
 * @returns {object} objeto resposta
 */
export const createErrorResponse = (statusCode, message) => {
  return {
    statusCode,
    error: true,
    message
  };
}

/**
 * cria resposta padrão de sucesso
 * @param {string} message
 * @param {object} data
 * @returns {object} objeto resposta
 */
export const createSuccessResponse = (message, data = null) => {
  const response = {
    error: false,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return response;
};

/**
 * valida ID e busca item na array
 * @param {string} id
 * @param {Array} array
 * @param {string} itemName - nome do item (para mensagens de erro)
 * @returns {object} { success: boolean, error: object|null, item: object|null, index: number, parsedId: number|null }
 */
export const validateAndFindItem = (id, array, itemName = "Item") => {
  // validar o ID
  const idValidation = validateId(id);
  if (!idValidation.isValid) {
    return {
      success: false,
      error: createErrorResponse(400, idValidation.error),
      item: null,
      index: -1,
      parsedId: null
    };
  }

  const searchResult = findItemById(array, idValidation.parsedId, itemName);
  if (!searchResult.found) {
    return {
      success: false,
      error: createErrorResponse(404, searchResult.error),
      item: null,
      index: -1,
      parsedId: idValidation.parsedId
    };
  }

  return {
    success: true,
    error: null,
    item: searchResult.item,
    index: searchResult.index,
    parsedId: idValidation.parsedId
  };
}

/**
 * envia resposta de erro padronizada
 * @param {object} res - response do express
 * @param {object} errorResponse - objeto de erro criado por createErrorResponse
 * @returns resposta HTTP com status e JSON
 */
export const sendErrorResponse = (res, errorResponse) => {
  return res.status(errorResponse.statusCode).json(errorResponse);
};

/** * envia resposta de sucesso padronizada
 * @param {object} res - response do express
 * @param {string} message - mensagem de sucesso
 * @param {object} data - dados adicionais (opcional)
 * @param {number} statusCode - código HTTP (padrão 200)
 * @returns resposta HTTP com status e JSON
 */
export const sendSuccessResponse = (res, message, data = null, statusCode = 200) => {
  const response = createSuccessResponse(message, data);
  return res.status(statusCode).json(response);
};
