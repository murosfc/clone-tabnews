function status(reques, response) {
  response.status(200).json({ status: "ok" });
}

export default status;
