import {Connection, createConnection} from "typeorm";
import { Card} from "./entities/card"

export const getConnection = async(): Promise<Connection> => {

    
    const connection = await createConnection({
        type: 'aurora-mysql',
        database: 'trelloBasic',
        secretArn: "arn:aws:secretsmanager:us-east-1:123456789012:secret:dummy",
        resourceArn: "arn:aws:rds:us-east-1:123456789012:cluster:dummy",
        region: 'eu-west-1',
        entities: [Card],
        serviceConfigOptions: {
            endpoint: "http://local-data-api:80"
        }
    })

    return connection
}