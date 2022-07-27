// Render Data from API

const displayData = (element, data) => {
  // const dataRender = data.slice(page - 1, page + 3);
  const content = data?.reduce(
    (dom, { id, name, address: { street, suite, city }, email, phone }) =>
      `${dom}
      <tr>
        <td class="border px-8 py-2">${id}</td>
        <td class="border px-8 py-2">${name}</td>
        <td class="border px-8 py-2">${street}${", "} ${suite}${", "} ${city} </td>
        <td class="border px-8 py-2">${email}</td>
        <td class="border px-8 py-2">${phone}</td>
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

  element.innerHTML = `<tr>
    <th class="bg-blue-100 border text-center px-8 py-4">ID</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Name</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Address</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Email</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Phone</th>
    <th class="bg-blue-100 border text-center px-8 py-4">Action</th>
  </tr>${content}`;
};
//pagination

const tableContent = document.getElementById("table-content");
const pagination = document.getElementById("pagination");

let currentPage = 1;
let rows = 4;
let dataDisplay;

const fnc = async () => {
  const data = await fetch("https://jsonplaceholder.typicode.com/users").then(
    (res) => res.json()
  );
  dataDisplay = data;
  return data;
};

const displayList = async (items_per_page, page) => {
  page--;
  let start = items_per_page * page;
  let end = start + items_per_page;
  const data = await fnc();
  console.log(dataDisplay);
  console.log(data);
  let paginatedItem = data?.slice(start, end);
  // console.log(paginatedItem);

  displayData(tableContent, paginatedItem);

  // tableContent.innerHTML += paginatedItem?.reduce(
  //   (dom, { id, name, address: { street, suite, city }, email, phone }) =>
  //     `${dom}
  // <tr>
  //   <td class="border px-8 py-2">${id}</td>
  //   <td class="border px-8 py-2">${name}</td>
  //   <td class="border px-8 py-2">${street}${", "} ${suite}${", "} ${city} </td>
  //   <td class="border px-8 py-2">${email}</td>
  //   <td class="border px-8 py-2">${phone}</td>
  //   <td
  //     class="flex flex-row items-center justify-center text-center gap-2 border px-8 py-4"
  //   >
  //     <button
  //       class="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 w-[100px] rounded-lg"
  //     >
  //       Edit
  //     </button>
  //     <button
  //       class="px-4 py-2 bg-red-500 hover:bg-red-600 w-[100px] rounded-lg"
  //     >
  //       Delete
  //     </button>
  //   </td>
  // </tr>`,
  //   ""
  // );
};

const pageButtonList = async (rows_per_page) => {
  const data = await fetch("https://jsonplaceholder.typicode.com/users").then(
    (res) => res.json()
  );
  let page_count = Math.ceil(data.length / rows_per_page);

  for (let i = 1; i < page_count + 1; i++) {
    let btn = paginationButton(i);
    pagination.appendChild(btn);
  }
};

const paginationButton = (page) => {
  let button = document.createElement("button");
  button.innerText = page;
  button.setAttribute(
    "class",
    "hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow cursor-pointer"
  );

  if (currentPage == page) {
    button.classList.add("active");
  }

  button.addEventListener("click", () => {
    currentPage = page;
    displayList(rows, currentPage);

    let currentBtn = document.querySelector("button.active");
    currentBtn.classList.remove("active");

    button.classList.add("active");
  });
  return button;
};

displayList(rows, currentPage);
pageButtonList(rows);

//search
const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("keyup", async (event) => {
  const searchString = event.target.value.toLowerCase();

  const data = await fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => data.map((data) => data));

  const filteredList = data.filter((data) => {
    return data.name.toLowerCase().includes(searchString);
  });

  displayData(tableContent, filteredList);
});
