import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Card } from './database/entities/card';
import { getConnection } from './database/dbConnection';
import { DeleteResult } from 'typeorm';

const defaultHeaders = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

export const getOptionsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return {
        headers: {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,DELETE,POST,GET,PUT',
        },
        statusCode: 200,
        body: JSON.stringify({
            success: true,
        }),
    };
};

export const getCardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        let conn = await getConnection();
        let cardRepo = await conn.getRepository(Card);
        let card = await cardRepo.find();

        response = {
            headers: defaultHeaders,
            statusCode: 200,
            body: JSON.stringify(card),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err,
            }),
        };
    }

    return response;
};

export const updateCardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        let conn = await getConnection();
        let cardRepo = await conn.getRepository(Card);

        const id = event.pathParameters?.id;

        if (id) {
            let existingCard: Card | null = await cardRepo.findOne({
                where: { id: +id },
            });

            if (existingCard) {
                const body = JSON.parse(event.body!);

                await cardRepo.update(id, { title: body.title, tableName: body.tableName });

                response = {
                    headers: defaultHeaders,
                    statusCode: 204,
                    body: JSON.stringify({
                        success: true,
                    }),
                };
            }
        } else {
            response = {
                statusCode: 404,
                body: JSON.stringify({ error: 'Card not found' }),
            };
        }
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err,
            }),
        };
    }

    return response!;
};

export const deleteCardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        let conn = await getConnection();
        let cardRepo = await conn.getRepository(Card);

        const id = event.pathParameters?.id;

        if (id) {
            let result: DeleteResult = await cardRepo.delete({ id: +id });

            if (result?.raw?.numberOfRecordsUpdated != 0) {
                response = {
                    headers: defaultHeaders,
                    statusCode: 204,
                    body: JSON.stringify({
                        success: true,
                    }),
                };
            }
        } else {
            response = {
                statusCode: 404,
                body: JSON.stringify({ error: 'Card not found' }),
            };
        }
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err,
            }),
        };
    }

    return response!;
};

export const createCardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        let conn = await getConnection();
        let cardRepo = await conn.getRepository(Card);

        const body = JSON.parse(event.body!);

        let newCard: Card = new Card();

        newCard.title = body.title;
        newCard.tableName = body.tableName;

        const result = await cardRepo.save(newCard);

        response = {
            headers: defaultHeaders,
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                id: result.id,
            }),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err,
            }),
        };
    }

    return response;
};
