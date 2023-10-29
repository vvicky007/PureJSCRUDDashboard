const body = document.querySelector('body')

const { setCookie, getCookieVal, createButton, createHeading, createInput } = function utilsModule() {
    const setCookie = (val) => {
        document.cookie = (document.cookie ?? '') + val
    }
    const getCookieVal = (key) => {
        try{
            return document.cookie
            .split('; ')
            .find(row => row.startsWith(key + '='))
            .split('=')[1];
        }
        catch(e){
            return ''
        }
      
    }
    const preventDefault = (event) => (fn) => {
        event.preventDefault()
        fn();
    }
    const createButton = (text = '') => {
        const button = document.createElement('button')
        button.classList.add('btn')
        button.innerHTML = text
        return button
    }
    const createHeading = (val = '') => {
        const heading = document.createElement('h4')
        heading.innerText = val
        heading.classList.add('font-size-heading', 'margin-small')
        return heading
    }
    const createInput = (props) => {
        const { label = '', type = '', placeholder = '', id = '', required = false } = props
        const labelElement = document.createElement('label')
        labelElement.innerText = label
        const input = document.createElement('input')
        input.placeholder = placeholder
        input.type = type
        input.id = id
        labelElement.setAttribute('for', id)
        labelElement.classList.add('padding-small')
        input.classList.add('input', 'margin-small')
        input.required = required
        return {
            label: labelElement, input
        }
    }
    return { setCookie, getCookieVal, createButton, createHeading, createInput }
}();
/*
"login_id" : "test@sunbasedata.com",
"password" :"Test@123
*/
const { getHeaders, getTableCell } = function tableUtils() {
    const getHeaders = (headings = []) => {
        return headings.map((heading) => {
            const th = document.createElement('th')
            th.innerHTML = heading
            return th
        })
    }
    const getTableCell = (val = '') => {
        const td = document.createElement('td')
        td.innerHTML = val
        return td
    }
    return {
        getHeaders,
        getTableCell
    }
}()
const { makePostCall, getCustomers, addCustomer, deleteCustomer } = function networkUtils() {
    const BASE_URL = 'https://qa2.sunbasedata.com/sunbase/portal/api/'
    const authHeaders = () => {
        const token = getCookieVal('auth_token') + '='
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        return headers
    }
    async function makePostCall(postParams) {
        // Don't use try catch block as this always return cors error
        try {
            const { endPoint, body } = postParams
            const response = await fetch(`${BASE_URL}${endPoint}`, {
                method: 'POST',
                body: JSON.stringify(body)
            })
            const jsonResponse = await response.json();
            return jsonResponse;


        }
        catch (e) {
            return;
        }

    }
    async function getCustomers() {
        const data = await fetch(`${BASE_URL}assignment.jsp?cmd=get_customer_list`, {
            headers: {
                ...authHeaders()
            }
        })

        const list = await data.json();
        return list
    }
    async function addCustomer(customer) {
        try {
            data = await fetch(`${BASE_URL}assignment.jsp?cmd=create`, {
                method: 'POST',
                headers: {
                    ...authHeaders()
                },
                body: JSON.stringify(customer)
            })
            return true
        }
        catch (e) {
            return false
        }
    }
    async function deleteCustomer(uuid='') {
        try {
            data = await fetch(`${BASE_URL}assignment.jsp?cmd=delete&uuid=${uuid}`, {
                method: 'POST',
                headers: {
                    ...authHeaders()
                },
            })
            return true
        }
        catch (e) {
            return false
        }
    }
    return { makePostCall, getCustomers, addCustomer, deleteCustomer }
}()

function buildLoginPage() {

    function buildFormHeader() {
        const formHeader = document.createElement('h5');
        formHeader.innerText = 'Login Form'
        formHeader.classList.add('bolder')
        formHeader.classList.add('font-size-heading')
        return formHeader;
    }
    function buildFormBody() {
        const formBody = document.createElement('section');
        formBody.classList.add('login-form__body')
        formBody.classList.add('flex')
        formBody.classList.add('flex-column')
        formBody.classList.add('align-center')
        formBody.classList.add('justify-space-around')
        return formBody;
    }
    function buildInputFields() {
        let apiCallStatus = null
        const form = document.createElement('form')
        const loginId = document.createElement('input')
        const password = document.createElement('input')
        const submitButton = document.createElement('button')
        const formElements = [loginId, password, submitButton]
        loginId.placeholder = 'User Login Id'
        password.placeholder = 'Password'
        password.type = 'password'
        submitButton.innerText = 'Submit'
        submitButton.classList.add('btn')
        submitButton.classList.add('width-100')

        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            onFormSubmit({
                loginId: loginId.value,
                password: password.value
            })
            setPageRoute('DEFAULT')
        })
        form.addEventListener('submit', (event) => {
            event.preventDefault();
        })
        form.classList.add('flex-center')
        form.classList.add('flex-column')
        form.classList.add('login-form__elements')
        form.classList.add('justify-space-around')
        formElements.forEach((formElement) => {
            form.appendChild(formElement)
        })
        return {
            form, loginId, password
        }
    }

    async function onFormSubmit(formDetails) {
        const { loginId, password } = formDetails
        const { access_token } = await makePostCall({
            endPoint: 'assignment_auth.jsp', body: {
                "login_id": loginId,
                password
            }
        });
        setCookie(`auth_token=${access_token}`)
    }


    const formSection = document.createElement('main');
    const formBody = buildFormBody();
    const formHeader = buildFormHeader();
    const { form, loginId, password } = buildInputFields();


    formSection.classList.add('login-form')
    formSection.appendChild(formBody);
    formBody.appendChild(formHeader)
    formBody.appendChild(form)
    body.replaceChildren(formSection)
}
/**
 * {
  "uuid": "test2ad024d2092e4acf9671efa446304dab",
  "first_name": "balu",
  "last_name": "bai",
  "street": "ejhdd",
  "address": "efde",
  "city": "",
  "state": "",
  "email": "",
  "phone": ""
}
 */
const { setPageRoute, getPageRoute } = function PageRoute() {
    let pageRoute = 'DEFAULT'
    function setPageRoute(val = '') {
        pageRoute = val
        renderWebPage(pageRoute)
    }
    function getPageRoute() {
        return pageRoute
    }
    return {
        setPageRoute,
        getPageRoute
    }
}()

function customerListScreen() {
    const dashboard = document.createElement('main')
    const tableHeaders = ['First Name', 'Last Name', 'Address', 'City', 'State', 'Email', 'Phone', 'Action']
    const keysMappingToModel = ['first_name', 'last_name', 'address', 'city', 'state', 'email', 'phone']
    dashboard.classList.add('flex-center')
    dashboard.classList.add('width-100')
    async function getCustomersList() {
        renderCustomersListTable({ customersList: [], isLoading: true })
        const customersList = await getCustomers();
        renderCustomersListTable({ customersList, isLoading: false })
        return customersList
    }
    function createTableHeader() {
        const tableHeader = document.createElement('section');
        const addCustomerButton = document.createElement('button')
        const tableHeadingSection = document.createElement('section')
        const tableHeading = document.createElement('h5')
        addCustomerButton.addEventListener('click', () => {
            setPageRoute('ADD_CUSTOMERS')
        })
        tableHeadingSection.classList.add('width-100', 'flex-center')
        tableHeadingSection.appendChild(tableHeading)
        tableHeader.classList.add('flex')
        tableHeader.classList.add('width-100')
        tableHeading.innerText = 'Customers List'
        tableHeading.classList.add('font-size-heading')
        addCustomerButton.innerText = 'Add Customer'
        addCustomerButton.classList.add('btn', 'btn-min-width')
        tableHeader.appendChild(addCustomerButton)
        tableHeader.appendChild(tableHeadingSection)
        return {
            tableHeader
        }
    }
    function createLoader() {
        const loaderSection = document.createElement('h1')
        loaderSection.innerText = 'Loading'
        return {
            loaderSection
        }
    }
    function createTable(props) {
        const { customersList = [] } = props
        const table = document.createElement('table')
        const tableHeadingRow = document.createElement('tr')
        const tableBody = customersList.map((customer) => {
            const tr = document.createElement('tr')
            const cells = keysMappingToModel.map((key) => getTableCell(customer[key]))
            const actionButton = createButton('Delete')
            const editButton = createButton('Edit')
            actionButton.setAttribute('data-id', customer['uuid'])
            actionButton.setAttribute('data-action-type', 'delete-customer')
            editButton.setAttribute('data-id', customer['uuid'])
            editButton.setAttribute('data-action-type', 'edit-customer')
            tr.append(...cells, actionButton, editButton)
            return tr
        })
        table.addEventListener('click', async(event) => {
            const target = event.target
            const actionType = target.getAttribute('data-action-type')
            if(actionType === 'delete-customer'){
                const uuid = target.getAttribute('data-id')
                await deleteCustomer(uuid)
                setPageRoute('DEFAULT')
            }
        })
        tableHeadingRow.append(...getHeaders(tableHeaders))
        table.appendChild(tableHeadingRow)
        table.append(...tableBody)
        return {
            table
        }
    }
    function renderCustomersListTable(props) {
        const { customersList, isLoading } = props
        const dashboardTable = document.createElement('section')
        const { tableHeader } = createTableHeader()
        const { table } = createTable({ customersList });
        if (isLoading) {
            const { loaderSection } = createLoader()
            dashboard.replaceChildren(loaderSection)
            return;
        }
        dashboardTable.classList.add('width-100')
        dashboardTable.appendChild(tableHeader)
        dashboardTable.appendChild(table)
        dashboard.replaceChildren(dashboardTable)

        body.replaceChildren(dashboard)
    }
    const customersList = getCustomersList();

}
function createCustomerScreen() {
    const mainContent = document.createElement('main')
    //label = '', type = '', placeholder = '', id = ''
    const formInputObjects = {
        'first_name': {
            label: 'First Name',
            type: '',
            placeholder: 'First Name',
            id: 'first_name',
            required: true
        },
        'last_name': {
            label: 'Last Name',
            type: '',
            placeholder: 'Last Name',
            id: 'last_name',
            required: true
        },
        'street': {
            label: 'Street',
            type: '',
            placeholder: 'Street',
            id: 'street'
        },
        address: {
            label: 'Address',
            type: '',
            placeholder: 'Address',
            id: 'address'
        },
        city: {
            label: 'City',
            type: '',
            placeholder: 'City',
            id: 'city'
        },
        state: {
            label: 'State',
            type: '',
            placeholder: 'State',
            id: 'state'
        },
        email: {
            label: 'Email',
            type: '',
            placeholder: 'Email',
            id: 'email'
        },
        phone: {
            label: 'Phone',
            type: '',
            placeholder: 'Phone',
            id: 'phone'
        }


    }
    function createCustomerForm() {
        const formSection = document.createElement('section')
        const heading = createHeading('Customer Details')
        const form = document.createElement('form')
        form.classList.add('flex', 'flex-column')
        const formInputs = Object.values(formInputObjects).map((inputObj) => createInput(inputObj))
        formInputs.forEach((element) => {
            form.appendChild(element.label)
            form.appendChild(element.input)
        })
        const submitButton = createButton('Create')
        submitButton.classList.add('margin-small')
        formSection.appendChild(heading)
        formSection.appendChild(form)
        formSection.appendChild(submitButton)
        submitButton.addEventListener('click', async (event) => {
            const formObj = {}
            let error = false
            formInputs.forEach(({ input }) => {
                if (formInputObjects[input.id] && formInputObjects[input.id].required && input.value === '') {
                    error = true
                }
                formObj[input.id] = input.value
            })
            if (error) {
                const formError = document.createElement('section')
                formError.innerText = 'Form Contains Errors'
                formError.id = 'formError'
                formError.classList.add('error')
                formSection.appendChild(formError)
                return
            }
            const formError = formSection.querySelector(`#formError`)
            if(formError){
                formError.innerHTML = null
            }
            if (await addCustomer(formObj)) {
                setPageRoute('DEFAULT')
            }
        })
        return {
            formSection
        }
    }
    const { formSection } = createCustomerForm()
    mainContent.appendChild(formSection)
    body.replaceChildren(mainContent)
}

async function renderWebPage(route) {
    const authToken = getCookieVal('auth_token')
    if (route === 'DEFAULT') {
        if (!authToken) {
            buildLoginPage();
        }
        else {
            customerListScreen();
        }
    }
    else if (route === 'ADD_CUSTOMERS') {
        createCustomerScreen();
    }
}
renderWebPage(getPageRoute())
