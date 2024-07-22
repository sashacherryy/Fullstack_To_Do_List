import axios from 'axios';

interface Task {
  id: number;
  title: string;
  isDone: boolean;
}

interface GetTaskResponse {
  data: Task[];
}

const API_URL = 'http://localhost:3003';

export  async function getTask(): Promise<Task[]> {
  try {
    const response = await axios.get<GetTaskResponse>(
      `${API_URL}/api/todo`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (response.data && Array.isArray(response.data)) {
      return response.data;
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      throw new Error(error.message);
    } else {
      console.log('unexpected error: ', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function softDeleteTask(id: number): Promise<void> {
  try {
    await axios.patch(
      `${API_URL}/api/todo/delete/${id}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      throw new Error(error.message);
    } else {
      console.log('unexpected error: ', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function deleteTask(id: number): Promise<void> {
  try {
    await axios.delete(
      `${API_URL}/api/todo/${id}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      throw new Error(error.message);
    } else {
      console.log('unexpected error: ', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function addingTasks(title: string): Promise<void> {
  try {
    await axios.post(
      `${API_URL}/api/todo`,
      {
        title: title
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      throw new Error(error.message);
    } else {
      console.log('unexpected error: ', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function checkTask(id: number): Promise<void> {
  try {
    await axios.patch(
      `${API_URL}/api/todo/done/${id}`, 
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      throw new Error(error.message);
    } else {
      console.log('unexpected error: ', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

