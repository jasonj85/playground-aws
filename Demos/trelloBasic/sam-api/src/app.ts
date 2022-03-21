import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Card } from "./database/entities/card";
import { getConnection } from "./database/dbConnection";

export const getCardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        let conn = await getConnection();
        let cardRepo = await conn.getRepository(Card);
        let card = await cardRepo.find();

        response = {
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
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'update cards here',
            }),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }

    return response;
};

export const deleteCardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;
    try {
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'delete cards here',
            }),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }

    return response;
};

export const createCardHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    let response: APIGatewayProxyResult;

    try {
        let conn = await getConnection();
        let cardRepo = await conn.getRepository(Card);
             
        const body = JSON.parse(event.body);

        let newCard: Card = new Card();

        newCard.title = body.title;
        newCard.tableName = body.tableName;
        
        const result = await cardRepo.save(newCard)
        
        response = {
            statusCode: 200,
            body: JSON.stringify({
                "success": true, 
                "id": result.id
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
