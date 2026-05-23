const QUEUE_KEY = "invoice_sync_queue";
let _processing = false;

function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function addToQueue(entry) {
  const queue = getQueue();
  const item = {
    id: crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    retryCount: 0,
    maxRetries: 20,
    createdAt: new Date().toISOString(),
    lastAttempt: null,
    createdCustomerId: null,
    ...entry,
  };
  queue.push(item);
  saveQueue(queue);
}

export function removeFromQueue(id) {
  saveQueue(getQueue().filter((e) => e.id !== id));
}

export function getQueueLength() {
  return getQueue().length;
}

export async function processQueue(createCustomer, createInvoice) {
  if (_processing) return 0;
  _processing = true;
  let synced = 0;
  try {
    const queue = getQueue();
    for (const entry of queue) {
      try {
        let customerId = entry.createdCustomerId;
        if (!customerId && entry.customerData) {
          const custRes = await createCustomer(entry.customerData);
          customerId = custRes.data.data?.id;
          entry.createdCustomerId = customerId;
        }
        if (customerId && entry.invoiceData) {
          await createInvoice({ ...entry.invoiceData, customerId });
        }
        removeFromQueue(entry.id);
        synced++;
      } catch {
        const all = getQueue();
        const idx = all.findIndex((e) => e.id === entry.id);
        if (idx !== -1) {
          all[idx].retryCount = (all[idx].retryCount || 0) + 1;
          all[idx].lastAttempt = new Date().toISOString();
          if (entry.createdCustomerId) all[idx].createdCustomerId = entry.createdCustomerId;
          if (all[idx].retryCount >= all[idx].maxRetries) {
            all.splice(idx, 1);
          }
          saveQueue(all);
        }
      }
    }
  } finally {
    _processing = false;
  }
  return synced;
}
