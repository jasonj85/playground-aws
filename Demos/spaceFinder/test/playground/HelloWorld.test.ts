import { handler } from "../../services/SpacesTable/Create";

const event = {
  body: {
    location: "New York",
  },
};

handler(event as any, {} as any);
