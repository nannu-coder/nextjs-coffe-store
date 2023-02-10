import fetchCoffeStoresData from "../../lib/coffe-stores";

const getCoffeStore = async (req, res) => {
  try {
    const { latLong, limit } = req.query;

    const response = await fetchCoffeStoresData(latLong, limit);

    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

export default getCoffeStore;
