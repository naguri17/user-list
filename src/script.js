const TABLE_CONTENT_ELEMENT = document.getElementById("table-content");
const PAGINATION_ELEMENT = document.getElementById("pagination");
const SEARCH_ELEMENT = document.getElementById("search-bar");
let CURRENT_PAGE = 1;
let DEFAULT_PAGE_SIZE = 4;
let STORAGE = [];

window.addEventListener("load", async () => {
  await getData().then((res) => {
    console.log(res);
    STORAGE = res;
    paginationButtonGenerator(DEFAULT_PAGE_SIZE, STORAGE);
    const paginationData = handlePagination(DEFAULT_PAGE_SIZE, STORAGE);
    displayHandler(TABLE_CONTENT_ELEMENT, paginationData);
  });
});

// Get Data from API
const getData = async () => {
  const data = await fetch("https://jsonplaceholder.typicode.com/users").then(
    (res) => res.json()
  );
  return data;
};

// Render Data from API
const displayHandler = (element, data) => {
  const content = data?.reduce(
    (dom, { id, name, address: { street, suite, city }, email, phone }) =>
      `${dom}
    <tr>
      <td class="border px-8 py-2">${id}</td>
      <td class="border px-8 w-[300px] py-2">${name}</td>
      <td class="border px-8 w-[400px] py-2">${street}${", "} ${suite}${", "} ${city} </td>
      <td class="border px-8 w-[300px] py-2">${email}</td>
      <td class="border px-8 w-[200px] py-2">${phone}</td>
      <td
        class="flex flex-row items-center justify-center text-center gap-2 border px-8 py-4"
      >
        <button
          class="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 w-[100px] rounded-lg"
        >
          Edit
        </button>
        <button
          class="px-4 py-2 bg-red-500 hover:bg-red-600 w-[100px] rounded-lg"
        >
          Delete
        </button>
      </td>
    </tr>`,
    ""
  );

  element.innerHTML = `
  <tr>
    <th class="bg-blue-100 border text-center px-8 py-4">ID</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Name</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Address</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Email</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Phone</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Action</th>
  </tr>
  ${content}
  `;
};

// Pagination

const handlePagination = (pageSize = DEFAULT_PAGE_SIZE, data = []) => {
  CURRENT_PAGE = CURRENT_PAGE - 1;
  const start = pageSize * CURRENT_PAGE;
  const end = start + pageSize;
  return data?.slice(start, end);
};

const paginationButtonGenerator = async (
  pageSize = DEFAULT_PAGE_SIZE,
  data = []
) => {
  const pageCount = Math.ceil(data.length / pageSize);

  for (let i = 1; i < pageCount + 1; i++) {
    const btn = paginationButtonDisplayHandler(i);
    PAGINATION_ELEMENT.appendChild(btn);
  }
};

const paginationButtonDisplayHandler = (page) => {
  let button = document.createElement("button");
  button.innerText = page;
  button.setAttribute(
    "class",
    "hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer"
  );

  if (CURRENT_PAGE == page) {
    button.classList.add("active");
  }

  button.addEventListener("click", () => {
    CURRENT_PAGE = page;
    const pageData = handlePagination(DEFAULT_PAGE_SIZE, STORAGE);

    displayHandler(TABLE_CONTENT_ELEMENT, pageData);

    let currentBtn = document.querySelector("button.active");
    currentBtn.classList.remove("active");

    button.classList.add("active");
  });
  return button;
};

// Search
SEARCH_ELEMENT.addEventListener("keyup", async (event) => {
  const searchString = event.target.value.toLowerCase();

  CURRENT_PAGE = 1;

  const refetchData = await getData();

  STORAGE = refetchData.filter((data) => {
    return (
      !searchString.trim() ||
      data.name.toLowerCase().includes(searchString.trim())
    );
  });

  console.log({ STORAGE, searchString });

  PAGINATION_ELEMENT.innerHTML = "";

  paginationButtonGenerator(DEFAULT_PAGE_SIZE, STORAGE);
  const paginationData = handlePagination(DEFAULT_PAGE_SIZE, STORAGE);
  displayHandler(TABLE_CONTENT_ELEMENT, paginationData);
});
