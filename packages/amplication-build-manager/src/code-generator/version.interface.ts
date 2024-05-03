interface Version {
  changelog: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  id: string;
  isActive: boolean;
  isDeprecated: boolean | null;
  name: string | null;
  updatedAt: Date;
}

export { Version };
