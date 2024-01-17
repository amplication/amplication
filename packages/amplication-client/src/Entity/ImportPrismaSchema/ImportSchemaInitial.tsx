import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import { UploadSchemaStateProps } from "./uploadSchemaState";

export const ImportSchemaInitial = ({ className }: UploadSchemaStateProps) => (
  <div className={`${className}__header`}>
    <SvgThemeImage image={EnumImages.ImportPrismaSchema} />
    <h2>Import Prisma schema file</h2>
    <div className={`${className}__message`}>
      upload a Prisma schema file to import its content, and create entities and
      relations.
      <br />
      Only '*.prisma' files are supported.
    </div>
  </div>
);
