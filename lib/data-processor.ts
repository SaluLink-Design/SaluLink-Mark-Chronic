import { ChronicCondition, TreatmentBasket, ConditionWithBaskets } from '@/types';

export class DataProcessor {
  private chronicConditions: ChronicCondition[] = [];
  private treatmentBaskets: Map<string, ConditionWithBaskets> = new Map();

  constructor() {
    this.loadData();
  }

  private loadData() {
    // Load chronic conditions from CMS data
    this.loadChronicConditions();
    // Load treatment baskets from Discovery data
    this.loadTreatmentBaskets();
  }

  private loadChronicConditions() {
    // This would typically load from the CMS Chronic Conditions.csv file
    // For now, we'll use a subset of the data
    this.chronicConditions = [
      {
        condition: "Addison's Disease",
        icd10Code: "E27.1",
        icd10Description: "Primary adrenocortical insufficiency"
      },
      {
        condition: "Asthma",
        icd10Code: "J45.0",
        icd10Description: "Predominantly allergic asthma"
      },
      {
        condition: "Diabetes Mellitus Type 1",
        icd10Code: "E10.9",
        icd10Description: "Insulin-dependent diabetes mellitus without complications"
      },
      {
        condition: "Diabetes Mellitus Type 2",
        icd10Code: "E11.9",
        icd10Description: "Non-insulin-dependent diabetes mellitus without complications"
      },
      {
        condition: "Hypertension",
        icd10Code: "I10",
        icd10Description: "Essential (primary) hypertension"
      },
      {
        condition: "Chronic Renal Disease",
        icd10Code: "N18.9",
        icd10Description: "Chronic renal failure, unspecified"
      },
      {
        condition: "Rheumatoid Arthritis",
        icd10Code: "M06.99",
        icd10Description: "Rheumatoid arthritis, unspecified, site unspecified"
      },
      {
        condition: "Multiple Sclerosis",
        icd10Code: "G35",
        icd10Description: "Multiple sclerosis"
      },
      {
        condition: "Epilepsy",
        icd10Code: "G40.9",
        icd10Description: "Epilepsy, unspecified"
      },
      {
        condition: "Bipolar Mood Disorder",
        icd10Code: "F31.9",
        icd10Description: "Bipolar affective disorder, unspecified"
      }
    ];
  }

  private loadTreatmentBaskets() {
    // Load treatment baskets for each condition
    // This would typically parse the Discovery treatment-baskets CSV
    
    // Addison's Disease
    this.treatmentBaskets.set("E27.1", {
      condition: this.chronicConditions.find(c => c.icd10Code === "E27.1")!,
      diagnosticBasket: [
        {
          procedureDescription: "U & E only",
          procedureCode: "4171",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Creatinine",
          procedureCode: "4032/4221/4223",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Cortisol level",
          procedureCode: "4499",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "ACTH stimulation testing",
          procedureCode: "4523",
          coverageLimit: 1,
          basketType: "diagnostic"
        }
      ],
      ongoingManagementBasket: [
        {
          procedureDescription: "U & E only",
          procedureCode: "4171",
          coverageLimit: 3,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Creatinine",
          procedureCode: "4032/4221/4223",
          coverageLimit: 3,
          basketType: "ongoing_management"
        }
      ],
      specialistCoverage: 1
    });

    // Diabetes Type 1
    this.treatmentBaskets.set("E10.9", {
      condition: this.chronicConditions.find(c => c.icd10Code === "E10.9")!,
      diagnosticBasket: [
        {
          procedureDescription: "ECG - Electrocardiogram",
          procedureCode: "1232/1233/1236",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Microalbuminuria",
          procedureCode: "4261/4262",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Urine analysis (dipstick)",
          procedureCode: "4188",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "LDL cholesterol",
          procedureCode: "4026",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "HDL cholesterol",
          procedureCode: "4028",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Total cholesterol",
          procedureCode: "4027",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Triglycerides",
          procedureCode: "4147",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "U & E only",
          procedureCode: "4171",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Serum creatinine",
          procedureCode: "4032/4223",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Urine creatinine",
          procedureCode: "4221",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Two-hour glucose- OGTT",
          procedureCode: "4049",
          coverageLimit: 1,
          basketType: "diagnostic"
        },
        {
          procedureDescription: "Glucose - random/fasting",
          procedureCode: "4057",
          coverageLimit: 1,
          basketType: "diagnostic"
        }
      ],
      ongoingManagementBasket: [
        {
          procedureDescription: "ECG - Electrocardiogram",
          procedureCode: "1232/1233/1236",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Microalbuminuria",
          procedureCode: "4261/4262",
          coverageLimit: 2,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Urine analysis (dipstick)",
          procedureCode: "4188",
          coverageLimit: 4,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "LDL cholesterol",
          procedureCode: "4026",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "HDL cholesterol",
          procedureCode: "4028",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Total cholesterol",
          procedureCode: "4027",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Triglycerides",
          procedureCode: "4147",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "U & E only",
          procedureCode: "4171",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Serum creatinine",
          procedureCode: "4032/4223",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Urine creatinine",
          procedureCode: "4221",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "HbA1c",
          procedureCode: "4064",
          coverageLimit: 4,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Tonometry",
          procedureCode: "3014",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Basic capital equipped in own rooms by ophthalmologists",
          procedureCode: "3009",
          coverageLimit: 1,
          basketType: "ongoing_management"
        },
        {
          procedureDescription: "Fundus examination",
          procedureCode: "3003/3004/3027",
          coverageLimit: 1,
          basketType: "ongoing_management"
        }
      ],
      specialistCoverage: 5 // 1 Ophthalmologist + 4 Other Specialists
    });

    // Add more conditions as needed...
  }

  public getAllConditions(): ChronicCondition[] {
    return this.chronicConditions;
  }

  public getConditionByCode(icd10Code: string): ChronicCondition | undefined {
    return this.chronicConditions.find(c => c.icd10Code === icd10Code);
  }

  public getTreatmentBaskets(icd10Code: string): ConditionWithBaskets | undefined {
    return this.treatmentBaskets.get(icd10Code);
  }

  public searchConditions(query: string): ChronicCondition[] {
    const searchTerm = query.toLowerCase();
    return this.chronicConditions.filter(condition => 
      condition.condition.toLowerCase().includes(searchTerm) ||
      condition.icd10Code.toLowerCase().includes(searchTerm) ||
      condition.icd10Description.toLowerCase().includes(searchTerm)
    );
  }

  public getConditionsByKeywords(keywords: string[]): ChronicCondition[] {
    const matchedConditions: ChronicCondition[] = [];
    
    keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      this.chronicConditions.forEach(condition => {
        if (
          condition.condition.toLowerCase().includes(lowerKeyword) ||
          condition.icd10Description.toLowerCase().includes(lowerKeyword) ||
          this.hasRelatedKeywords(condition, lowerKeyword)
        ) {
          if (!matchedConditions.find(c => c.icd10Code === condition.icd10Code)) {
            matchedConditions.push(condition);
          }
        }
      });
    });
    
    return matchedConditions;
  }

  private hasRelatedKeywords(condition: ChronicCondition, keyword: string): boolean {
    // Define keyword mappings for better matching
    const keywordMappings: { [key: string]: string[] } = {
      'diabetes': ['diabetes', 'diabetic', 'glucose', 'insulin', 'sugar'],
      'heart': ['cardiac', 'heart', 'cardiovascular', 'coronary'],
      'kidney': ['renal', 'kidney', 'nephritis', 'nephropathy'],
      'lung': ['pulmonary', 'lung', 'respiratory', 'asthma', 'copd'],
      'joint': ['arthritis', 'joint', 'rheumatoid', 'arthropathy'],
      'brain': ['neurological', 'brain', 'epilepsy', 'seizure', 'ms'],
      'thyroid': ['thyroid', 'hypothyroidism', 'hyperthyroidism'],
      'adrenal': ['adrenal', 'cortisol', 'addison'],
      'blood': ['haemophilia', 'bleeding', 'coagulation'],
      'eye': ['glaucoma', 'retinal', 'ophthalmic', 'vision']
    };

    for (const [category, relatedKeywords] of Object.entries(keywordMappings)) {
      if (relatedKeywords.includes(keyword)) {
        return relatedKeywords.some(relatedKeyword => 
          condition.condition.toLowerCase().includes(relatedKeyword) ||
          condition.icd10Description.toLowerCase().includes(relatedKeyword)
        );
      }
    }

    return false;
  }
}
