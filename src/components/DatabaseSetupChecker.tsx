import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface TableStatus {
  name: string;
  exists: boolean;
  hasData?: boolean;
  error?: string;
}

const DatabaseSetupChecker = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [overallStatus, setOverallStatus] = useState<'checking' | 'good' | 'issues' | 'error'>('checking');

  const checkTable = async (tableName: string): Promise<TableStatus> => {
    try {
      // Try to select from the table
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          return { name: tableName, exists: false, error: 'Table does not exist' };
        }
        return { name: tableName, exists: true, hasData: false, error: error.message };
      }

      return {
        name: tableName,
        exists: true,
        hasData: data && data.length > 0
      };
    } catch (error) {
      return {
        name: tableName,
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const checkDatabaseSetup = async () => {
    setIsChecking(true);
    setOverallStatus('checking');

    try {
      const tables = ['profiles', 'movies'];
      const statuses: TableStatus[] = [];

      for (const table of tables) {
        const status = await checkTable(table);
        statuses.push(status);
      }

      setTableStatuses(statuses);

      const allExist = statuses.every(s => s.exists);
      const hasErrors = statuses.some(s => s.error);

      if (allExist && !hasErrors) {
        setOverallStatus('good');
        toast.success('Database setup looks good!');
      } else {
        setOverallStatus('issues');
        toast.warning('Database setup has issues. Check the details below.');
      }
    } catch (error) {
      console.error('Database check failed:', error);
      setOverallStatus('error');
      toast.error('Failed to check database setup');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkDatabaseSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusIcon = (status: TableStatus) => {
    if (!status.exists) return <XCircle className="w-5 h-5 text-red-500" />;
    if (status.error) return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = (status: TableStatus) => {
    if (!status.exists) return 'Table does not exist';
    if (status.error) return `Error: ${status.error}`;
    return status.hasData ? 'Table exists with data' : 'Table exists (empty)';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Setup Checker
        </CardTitle>
        <CardDescription>
          Check if your Supabase database tables are properly configured
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {overallStatus === 'checking' && <RefreshCw className="w-5 h-5 animate-spin" />}
            {overallStatus === 'good' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {overallStatus === 'issues' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
            {overallStatus === 'error' && <XCircle className="w-5 h-5 text-red-500" />}

            <span className="font-medium">
              {overallStatus === 'checking' && 'Checking database...'}
              {overallStatus === 'good' && 'Database setup is good!'}
              {overallStatus === 'issues' && 'Database setup has issues'}
              {overallStatus === 'error' && 'Failed to check database'}
            </span>
          </div>

          <Button
            onClick={checkDatabaseSetup}
            disabled={isChecking}
            variant="outline"
            size="sm"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Recheck
              </>
            )}
          </Button>
        </div>

        {tableStatuses.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Table Status:</h4>
            {tableStatuses.map((status) => (
              <div key={status.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="font-medium capitalize">{status.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {getStatusText(status)}
                </span>
              </div>
            ))}
          </div>
        )}

        {overallStatus === 'issues' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your database setup is incomplete. Please run the SQL commands from{' '}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">supabase-setup.sql</code>{' '}
              in your Supabase SQL Editor.
            </AlertDescription>
          </Alert>
        )}

        {overallStatus === 'good' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Great! Your database is properly configured. You can now use all features of the app.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseSetupChecker;