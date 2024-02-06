export const nextCrmPredefinedSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model crm_Accounts {
  id                   String               @id @default(auto()) @map("_id") @db.ObjectId
  v                    Int                  @map("__v")
  createdAt            DateTime?            @default(now()) @db.Date
  createdBy            String?              @db.ObjectId
  updatedAt            DateTime?            @updatedAt @db.Date
  updatedBy            String?              @db.ObjectId
  annual_revenue       String?
  assigned_to          String?              @db.ObjectId
  billing_city         String?
  billing_country      String?
  billing_postal_code  String?
  billing_state        String?
  billing_street       String?
  company_id           String?
  description          String?
  email                String?
  employees            String?
  fax                  String?
  industry             String?              @db.ObjectId
  member_of            String?
  name                 String
  office_phone         String?
  shipping_city        String?
  shipping_country     String?
  shipping_postal_code String?
  shipping_state       String?
  shipping_street      String?
  status               String?              @default("Inactive")
  type                 String?              @default("Customer")
  vat                  String?
  website              String?
  invoices             Invoices[]
  documentsIDs         String[]             @db.ObjectId
  assigned_documents   Documents[]          @relation(fields: [documentsIDs], references: [id])
  contacts             crm_Contacts[]
  leads                crm_Leads[]
  industry_type        crm_Industry_Type?   @relation(fields: [industry], references: [id])
  opportunities        crm_Opportunities[]
  assigned_to_user     Users?               @relation(fields: [assigned_to], references: [id])
  crm_accounts_tasks   crm_Accounts_Tasks[]
  watchers             String[]             @db.ObjectId
  watching_users       Users[]              @relation(name: "watching_accounts", fields: [watchers], references: [id])
}

model crm_Leads {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  v  Int    @default(0) @map("__v")

  createdAt          DateTime?     @default(now()) @db.Date
  createdBy          String?       @db.ObjectId
  updatedAt          DateTime?     @updatedAt @db.Date
  updatedBy          String?       @db.ObjectId
  firstName          String?
  lastName           String
  company            String?
  jobTitle           String?
  email              String?
  phone              String?
  description        String?
  lead_source        String?
  refered_by         String?
  campaign           String?
  status             String?       @default("NEW")
  type               String?       @default("DEMO")
  assigned_to        String?       @db.ObjectId
  assigned_to_user   Users?        @relation(fields: [assigned_to], references: [id])
  accountsIDs        String?       @db.ObjectId
  assigned_accounts  crm_Accounts? @relation(fields: [accountsIDs], references: [id])
  documentsIDs       String[]      @db.ObjectId
  assigned_documents Documents[]   @relation(fields: [documentsIDs], references: [id])
}

enum crm_Lead_Status {
  NEW
  CONTACTED
  QUALIFIED
  LOST
}

enum crm_Lead_Type {
  DEMO
}

model crm_Opportunities {
  id                   String                          @id @default(auto()) @map("_id") @db.ObjectId
  v                    Int                             @default(0) @map("__v")
  account              String?                         @db.ObjectId
  assigned_to          String?                         @db.ObjectId
  budget               Int                             @default(0)
  campaign             String?                         @db.ObjectId
  close_date           DateTime?                       @db.Date
  contact              String?                         @db.ObjectId
  created_by           String?                         @db.ObjectId
  createdBy            String?                         @db.ObjectId
  created_on           DateTime?                       @default(now()) @db.Date
  createdAt            DateTime?                       @default(now()) @db.Date
  last_activity        DateTime?                       @db.Date
  updatedAt            DateTime?                       @updatedAt @db.Date
  updatedBy            String?                         @db.ObjectId
  last_activity_by     String?                         @db.ObjectId
  currency             String?
  description          String?
  expected_revenue     Int                             @default(0)
  name                 String?
  next_step            String?
  sales_stage          String?                         @db.ObjectId
  type                 String?                         @db.ObjectId
  status               crm_Opportunity_Status?         @default(ACTIVE)
  assigned_type        crm_Opportunities_Type?         @relation(fields: [type], references: [id])
  assigned_sales_stage crm_Opportunities_Sales_Stages? @relation(name: "assinged_sales_stage", fields: [sales_stage], references: [id])
  assigned_to_user     Users?                          @relation(name: "assigned_to_user_relation", fields: [assigned_to], references: [id])
  created_by_user      Users?                          @relation(name: "created_by_user_relation", fields: [created_by], references: [id])
  assigned_account     crm_Accounts?                   @relation(fields: [account], references: [id])
  assigned_campaings   crm_campaigns?                  @relation(fields: [campaign], references: [id])
  connected_documents  String[]                        @db.ObjectId
  documents            Documents[]                     @relation(fields: [connected_documents], references: [id])
  connected_contacts   String[]                        @db.ObjectId
  contacts             crm_Contacts[]                  @relation(fields: [connected_contacts], references: [id])
}

enum crm_Opportunity_Status {
  ACTIVE
  INACTIVE
  PENDING
  CLOSED
}

model crm_campaigns {
  id            String              @id @default(auto()) @map("_id") @db.ObjectId
  v             Int                 @map("__v")
  name          String
  description   String?
  status        String?
  opportunities crm_Opportunities[]
}

model crm_Opportunities_Sales_Stages {
  id                                 String              @id @default(auto()) @map("_id") @db.ObjectId
  v                                  Int                 @map("__v")
  name                               String
  probability                        Int?
  order                              Int?
  assigned_opportunities_sales_stage crm_Opportunities[] @relation(name: "assinged_sales_stage")
}

model crm_Opportunities_Type {
  id                     String              @id @default(auto()) @map("_id") @db.ObjectId
  v                      Int                 @map("__v")
  name                   String
  order                  Int?
  assigned_opportunities crm_Opportunities[]
}

model crm_Contacts {
  id                     String              @id @default(auto()) @map("_id") @db.ObjectId
  v                      Int                 @default(0) @map("__v")
  account                String?             @db.ObjectId
  assigned_to            String?             @db.ObjectId
  birthday               String?
  created_by             String?             @db.ObjectId
  createdBy              String?             @db.ObjectId
  created_on             DateTime?           @default(now())
  cratedAt               DateTime?           @default(now()) @db.Date
  last_activity          DateTime?           @default(now()) @db.Date
  updatedAt              DateTime?           @updatedAt @db.Date
  updatedBy              String?             @db.ObjectId
  last_activity_by       String?             @db.ObjectId
  description            String?
  email                  String?
  personal_email         String?
  first_name             String?
  last_name              String
  office_phone           String?
  mobile_phone           String?
  website                String?
  position               String?
  status                 Boolean             @default(true)
  social_twitter         String?
  social_facebook        String?
  social_linkedin        String?
  social_skype           String?
  social_instagram       String?
  social_youtube         String?
  social_tiktok          String?
  type                   String?             @default("Customer")
  assigned_to_user       Users?              @relation(name: "assigned_contacts", fields: [assigned_to], references: [id])
  crate_by_user          Users?              @relation(name: "created_contacts", fields: [created_by], references: [id])
  opportunitiesIDs       String[]            @db.ObjectId
  assigned_opportunities crm_Opportunities[] @relation(fields: [opportunitiesIDs], references: [id])
  accountsIDs            String?             @db.ObjectId
  assigned_accounts      crm_Accounts?       @relation(fields: [accountsIDs], references: [id])
  documentsIDs           String[]            @db.ObjectId
  assigned_documents     Documents[]         @relation(fields: [documentsIDs], references: [id])
}

enum crm_Contact_Type {
  Customer
  Partner
  Vendor
}

model Boards {
  id                String    @id @default(auto()) @map("_id") @db.ObjectId
  v                 Int       @map("__v")
  description       String
  favourite         Boolean?
  favouritePosition Int?
  icon              String?
  position          Int?
  title             String
  user              String    @db.ObjectId
  visibility        String?
  date_created      DateTime? @default(now()) @db.Date
  last_edited       DateTime? @db.Date
  //Create watechers field for board. It will be array of users
  watchers          String[]  @db.ObjectId
  assigned_user     Users?    @relation(name: "assigned_user", fields: [user], references: [id])
  watchers_users    Users[]   @relation(name: "watching_users", fields: [watchers], references: [id])
}

model Employees {
  id     String  @id @default(auto()) @map("_id") @db.ObjectId
  v      Int     @map("__v")
  avatar String
  email  String?
  name   String
  salary Int
  status String
}

model ImageUpload {
  id String @id @default(auto()) @map("_id") @db.ObjectId
}

model MyAccount {
  id                   String  @id @default(auto()) @map("_id") @db.ObjectId
  v                    Int     @map("__v")
  company_name         String
  is_person            Boolean @default(false)
  email                String?
  email_accountant     String?
  phone_prefix         String?
  phone                String?
  mobile_prefix        String?
  mobile               String?
  fax_prefix           String?
  fax                  String?
  website              String?
  // office Address
  street               String?
  city                 String?
  state                String?
  zip                  String?
  country              String?
  country_code         String?
  // billing Address
  billing_street       String?
  billing_city         String?
  billing_state        String?
  billing_zip          String?
  billing_country      String?
  billing_country_code String?
  //other
  currency             String?
  currency_symbol      String?
  VAT_number           String
  TAX_number           String?
  bank_name            String?
  bank_account         String?
  bank_code            String?
  bank_IBAN            String?
  bank_SWIFT           String?
}

model Invoices {
  id                            String          @id @default(auto()) @map("_id") @db.ObjectId
  v                             Int?            @map("__v")
  date_created                  DateTime        @default(now()) @db.Date
  last_updated                  DateTime        @updatedAt
  last_updated_by               String?         @db.ObjectId
  date_received                 DateTime?       @default(now()) @db.Date
  date_of_case                  DateTime?       @db.Date
  date_tax                      DateTime?       @db.Date
  date_due                      DateTime?       @db.Date
  description                   String?
  document_type                 String?
  favorite                      Boolean?        @default(false)
  variable_symbol               String?
  constant_symbol               String?
  specific_symbol               String?
  order_number                  String?
  internal_number               String?
  invoice_number                String?
  invoice_amount                String?
  invoice_file_mimeType         String
  invoice_file_url              String
  invoice_items                 Json?
  invoice_type                  String?
  invoice_currency              String?
  invoice_language              String?
  partner                       String?
  partner_street                String?
  partner_city                  String?
  partner_zip                   String?
  partner_country               String?
  partner_country_code          String?
  partner_business_street       String?
  partner_business_city         String?
  partner_business_zip          String?
  partner_business_country      String?
  partner_business_country_code String?
  partner_VAT_number            String?
  partner_TAX_number            String?
  partner_TAX_local_number      String?
  partner_phone_prefix          String?
  partner_phone_number          String?
  partner_fax_prefix            String?
  partner_fax_number            String?
  partner_email                 String?
  partner_website               String?
  partner_is_person             Boolean?
  partner_bank                  String?
  partner_account_number        String?
  partner_account_bank_number   String?
  partner_IBAN                  String?
  partner_SWIFT                 String?
  partner_BIC                   String?
  rossum_status                 String?
  rossum_annotation_id          String?
  rossum_annotation_url         String?
  rossum_document_id            String?
  rossum_document_url           String?
  rossum_annotation_json_url    String?
  rossum_annotation_xml_url     String?
  money_s3_url                  String?
  status                        String?
  invoice_state_id              String?         @db.ObjectId
  assigned_user_id              String?         @db.ObjectId
  assigned_account_id           String?         @db.ObjectId
  visibility                    Boolean         @default(true)
  invoice_states                invoice_States? @relation(fields: [invoice_state_id], references: [id])
  users                         Users?          @relation(fields: [assigned_user_id], references: [id])
  accounts                      crm_Accounts?   @relation(fields: [assigned_account_id], references: [id])
  connected_documents           String[]        @db.ObjectId
  documents                     Documents[]     @relation(fields: [connected_documents], references: [id])
}

model invoice_States {
  id                String     @id @default(auto()) @map("_id") @db.ObjectId
  name              String
  assigned_invoices Invoices[]
}

model Documents {
  id                     String              @id @default(auto()) @map("_id") @db.ObjectId
  v                      Int?                @map("__v")
  date_created           DateTime?           @default(now()) @db.Date
  createdAt              DateTime?           @default(now()) @db.Date
  last_updated           DateTime?           @updatedAt
  updatedAt              DateTime?           @updatedAt @db.Date
  document_name          String
  created_by_user        String?             @db.ObjectId
  createdBy              String?             @db.ObjectId
  description            String?
  document_type          String?             @db.ObjectId
  favourite              Boolean?
  document_file_mimeType String
  document_file_url      String
  status                 String?
  visibility             String?
  tags                   Json?
  key                    String?
  size                   Int?
  assigned_user          String?             @db.ObjectId
  connected_documents    String[]
  invoiceIDs             String[]            @db.ObjectId
  opportunityIDs         String[]            @db.ObjectId
  contactsIDs            String[]            @db.ObjectId
  tasksIDs               String[]            @db.ObjectId
  crm_accounts_tasksIDs  String[]            @db.ObjectId
  leadsIDs               String[]            @db.ObjectId
  accountsIDs            String[]            @db.ObjectId
  invoices               Invoices[]          @relation(fields: [invoiceIDs], references: [id])
  opportunities          crm_Opportunities[] @relation(fields: [opportunityIDs], references: [id])
  contacts               crm_Contacts[]      @relation(fields: [contactsIDs], references: [id])
  tasks                  Tasks[]             @relation(fields: [tasksIDs], references: [id])
  crm_accounts_tasks     crm_Accounts_Tasks? @relation(fields: [crm_accounts_tasksIDs], references: [id])
  leads                  crm_Leads[]         @relation(fields: [leadsIDs], references: [id])
  accounts               crm_Accounts[]      @relation(fields: [accountsIDs], references: [id])
  created_by             Users?              @relation(name: "created_by_user", fields: [created_by_user], references: [id])
  assigned_to_user       Users?              @relation(name: "assigned_to_user", fields: [assigned_user], references: [id])
  documents_type         Documents_Types?    @relation(fields: [document_type], references: [id])
  document_system_type   DocumentSystemType? @default(OTHER)
}

enum DocumentSystemType {
  INVOICE
  RECEIPT
  CONTRACT
  OFFER
  OTHER
}

model Documents_Types {
  id                 String      @id @default(auto()) @map("_id") @db.ObjectId
  v                  Int         @map("__v")
  name               String
  assigned_documents Documents[]
}

model Sections {
  id       String  @id @default(auto()) @map("_id") @db.ObjectId
  v        Int     @map("__v")
  board    String  @db.ObjectId
  title    String
  position Int?
  tasks    Tasks[]
}

model crm_Industry_Type {
  id       String         @id @default(auto()) @map("_id") @db.ObjectId
  v        Int            @map("__v")
  name     String
  accounts crm_Accounts[]
}

model modulStatus {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  isVisible Boolean
}

model Tasks {
  id               String          @id @default(auto()) @map("_id") @db.ObjectId
  v                Int             @map("__v")
  content          String?
  createdAt        DateTime?       @default(now()) @db.Date
  createdBy        String?         @db.ObjectId
  updatedAt        DateTime?       @updatedAt @db.Date
  updatedBy        String?         @db.ObjectId
  dueDateAt        DateTime?       @default(now()) @db.Date
  lastEditedAt     DateTime?       @default(now()) @updatedAt @db.Date
  position         Int
  priority         String
  section          String?         @db.ObjectId
  tags             Json?
  title            String
  likes            Int?            @default(0)
  user             String?         @db.ObjectId
  documentIDs      String[]        @db.ObjectId
  comments         tasksComments[]
  documents        Documents[]     @relation(fields: [documentIDs], references: [id])
  assigned_user    Users?          @relation(fields: [user], references: [id])
  assigned_section Sections?       @relation(fields: [section], references: [id])
  //Staus
  taskStatus       taskStatus?     @default(ACTIVE)
}

model crm_Accounts_Tasks {
  id            String          @id @default(auto()) @map("_id") @db.ObjectId
  v             Int             @map("__v")
  content       String?
  createdAt     DateTime?       @default(now()) @db.Date
  createdBy     String?         @db.ObjectId
  updatedAt     DateTime?       @updatedAt @db.Date
  updatedBy     String?         @db.ObjectId
  dueDateAt     DateTime?       @default(now()) @db.Date
  priority      String
  tags          Json?
  title         String
  likes         Int?            @default(0)
  user          String?         @db.ObjectId
  comments      tasksComments[]
  documents     Documents[]
  assigned_user Users?          @relation(fields: [user], references: [id])
  //CRM assigments
  account       String?         @db.ObjectId
  crm_accounts  crm_Accounts?   @relation(fields: [account], references: [id])
  //Staus
  taskStatus    taskStatus?     @default(ACTIVE)
}

model tasksComments {
  id                             String              @id @default(auto()) @map("_id") @db.ObjectId
  v                              Int                 @map("__v")
  comment                        String
  createdAt                      DateTime            @default(now()) @db.Date
  task                           String              @db.ObjectId
  user                           String              @db.ObjectId
  assigned_crm_account_task      String?             @db.ObjectId
  assigned_crm_account_task_task crm_Accounts_Tasks? @relation(fields: [assigned_crm_account_task], references: [id])
  assigned_task                  Tasks?              @relation(fields: [task], references: [id], onDelete: Cascade)
  assigned_user                  Users?              @relation(fields: [user], references: [id])
}

enum taskStatus {
  ACTIVE
  PENDING
  COMPLETE
}

model TodoList {
  id          String @id @default(auto()) @map("_id") @db.ObjectId
  createdAt   String
  description String
  title       String
  url         String
  user        String
}

enum ActiveStatus {
  ACTIVE
  INACTIVE
  PENDING
}

model Users {
  id                   String                @id @default(auto()) @map("_id") @db.ObjectId
  v                    Int                   @default(0) @map("__v")
  account_name         String?
  avatar               String?
  email                String                @unique
  is_account_admin     Boolean               @default(false)
  is_admin             Boolean               @default(false)
  created_on           DateTime              @default(now()) @db.Date
  lastLoginAt          DateTime?             @db.Date
  name                 String?
  password             String?
  username             String?
  userStatus           ActiveStatus          @default(PENDING)
  userLanguage         Language              @default(en)
  tasksComment         tasksComments[]
  created_by_documents Documents[]           @relation(name: "created_by_user")
  assigned_documents   Documents[]           @relation(name: "assigned_to_user")
  tasks                Tasks[]
  crm_accounts_tasks   crm_Accounts_Tasks[]
  accounts             crm_Accounts[]
  leads                crm_Leads[]
  created_by_user      crm_Opportunities[]   @relation(name: "created_by_user_relation")
  assigned_opportunity crm_Opportunities[]   @relation(name: "assigned_to_user_relation")
  assigned_contacts    crm_Contacts[]        @relation(name: "assigned_contacts")
  crated_contacts      crm_Contacts[]        @relation(name: "created_contacts")
  notion_account       secondBrain_notions[]
  openAi_key           openAi_keys[]
  assigned_invoices    Invoices[]
  boards               Boards[]              @relation(name: "assigned_user")
  watching_boardsIDs   String[]              @db.ObjectId
  watching_boards      Boards[]              @relation(name: "watching_users", fields: [watching_boardsIDs], references: [id])
  watching_accountsIDs String[]              @db.ObjectId
  watching_accounts    crm_Accounts[]        @relation(name: "watching_accounts", fields: [watching_accountsIDs], references: [id])
}

enum Language {
  cz
  en
  de
}

model system_Modules_Enabled {
  id       String  @id @default(auto()) @map("_id") @db.ObjectId
  v        Int     @map("__v")
  name     String
  enabled  Boolean
  position Int
}

model secondBrain_notions {
  id             String @id @default(auto()) @map("_id") @db.ObjectId
  v              Int    @map("__v")
  user           String @db.ObjectId
  notion_api_key String
  notion_db_id   String
  assigned_user  Users? @relation(fields: [user], references: [id])
}

model openAi_keys {
  id              String @id @default(auto()) @map("_id") @db.ObjectId
  v               Int    @map("__v")
  user            String @db.ObjectId
  organization_id String
  api_key         String
  assigned_user   Users? @relation(fields: [user], references: [id])
}

model systemServices {
  id              String  @id @default(auto()) @map("_id") @db.ObjectId
  v               Int     @map("__v")
  name            String
  serviceUrl      String?
  serviceId       String?
  serviceKey      String?
  servicePassword String?
  servicePort     String?
  description     String?
}

model gpt_models {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  v           Int        @map("__v")
  model       String
  description String?
  status      gptStatus?
  created_on  DateTime?  @default(now()) @db.Date
}

enum gptStatus {
  ACTIVE
  INACTIVE
}
`;
