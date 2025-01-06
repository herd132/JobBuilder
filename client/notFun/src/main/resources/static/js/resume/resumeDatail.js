const getworkerNo = () => {
  const workerNoMeta = document.querySelector('meta[name="workerNo"]');
  return workerNoMeta?.content || null;
};

const workerNo = getWorkerNo();