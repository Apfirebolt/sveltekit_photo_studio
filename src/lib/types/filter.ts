export interface IFilterDocument {
  filterId: string;           
  title: string;              
  description: string;        
  category: string;           
  type: 'canvas' | 'tensorflow';
  css?: string;               
  embedding: number[];       
  tags: string[];             
}