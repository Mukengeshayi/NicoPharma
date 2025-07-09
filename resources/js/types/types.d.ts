interface Medicine {
  id: number;
  name: string;
  code: string;
}

interface Form {
  id: number;
  name: string;
  default_content_unit_id?: number;
  compatible_packaging_ids?: number[];
}

interface PackagingUnit {
  id: number;
  name: string;
  compatible_form_ids?: number[];
}

interface ContentUnit {
  id: number;
  name: string;
  abbreviation: string;
}


type ApiErrors = Record<string, string[]>;
